import { NextResponse } from "next/server";
import { getCmsData } from "@/lib/cms-db";
import { buildPortfolioKnowledgePrompt } from "@/lib/ai-knowledge";
import { generateSmartFallbackReply } from "@/lib/ai-fallback-engine";
import {
  extractReferenceUrl,
  analyzeReferenceWebsite,
  buildWebsiteAnalysisPrompt,
} from "@/lib/link-analyzer";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface IncomingMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

interface IncomingImage {
  mimeType: string;
  data: string; // base64 without prefix
}

interface IncomingDocument {
  name: string;
  size: number;
  mimeType: string;
  textContent?: string;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, {
      scope: "ai-chat",
      limit: 25,
      windowMs: 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many AI assistant requests. Please wait a moment before sending another message.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds || 10) },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawMessages: IncomingMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];
    const rawImage: IncomingImage | undefined = body?.image;
    const rawDoc: IncomingDocument | undefined = body?.document;

    // Validate uploaded image if present
    let validImage: IncomingImage | null = null;
    if (
      rawImage &&
      typeof rawImage.data === "string" &&
      typeof rawImage.mimeType === "string"
    ) {
      const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const normalizedMime = rawImage.mimeType.toLowerCase();
      // Enforce safe formats and reasonable max base64 size (~6.5MB)
      if (allowedMimes.includes(normalizedMime) && rawImage.data.length < 7500000) {
        validImage = {
          mimeType: normalizedMime === "image/jpg" ? "image/jpeg" : normalizedMime,
          data: rawImage.data,
        };
      }
    }

    // Validate uploaded document metadata if present
    let validDocument: IncomingDocument | null = null;
    if (rawDoc && typeof rawDoc.name === "string") {
      validDocument = {
        name: rawDoc.name.slice(0, 120),
        size: typeof rawDoc.size === "number" ? rawDoc.size : 0,
        mimeType: typeof rawDoc.mimeType === "string" ? rawDoc.mimeType : "",
        textContent:
          typeof rawDoc.textContent === "string"
            ? rawDoc.textContent.slice(0, 15000)
            : undefined,
      };
    }

    if (rawMessages.length === 0 && !validImage && !validDocument) {
      return NextResponse.json(
        { success: false, error: "Messages array, image, or document is required." },
        { status: 400 }
      );
    }

    // Sanitize user messages & take last 10 turns to keep prompt focused
    const messages = rawMessages
      .filter((m) => typeof m?.content === "string" && m.content.trim())
      .slice(-10)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content.slice(0, 2000), // safety length limit
      }));

    // If message is empty but image was provided, set standard prompt
    let lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    if (!lastUserMessage && validImage) {
      lastUserMessage =
        "Can you analyze this design and let me know if you can create a website like this, with estimated timeline and budget?";
      messages.push({
        role: "user",
        content: lastUserMessage,
      });
    } else if (!lastUserMessage && validDocument) {
      lastUserMessage = `I have attached a document (${validDocument.name}) with project requirements. Can you let me know if Tarek can handle this?`;
      messages.push({
        role: "user",
        content: lastUserMessage,
      });
    }

    if (!lastUserMessage) {
      return NextResponse.json(
        { success: false, error: "No user message found." },
        { status: 400 }
      );
    }

    // 1. Retrieve dynamic CMS data
    const cmsData = await getCmsData();
    const aiSettings = cmsData.aiChatSettings;

    // If disabled via CMS settings
    if (aiSettings?.enabled === false) {
      return NextResponse.json({
        success: true,
        message:
          "The AI Assistant is currently disabled in website settings. Please contact Tarek directly at 01733119269 or 01840019449! 😊",
      });
    }

    // 2. Reference Website Link Analysis (if user shared a URL)
    const referenceUrl = extractReferenceUrl(lastUserMessage);
    let websitePromptSnippet = "";
    if (referenceUrl) {
      try {
        const analyzedWeb = await analyzeReferenceWebsite(referenceUrl);
        websitePromptSnippet = `\n\n${buildWebsiteAnalysisPrompt(analyzedWeb)}`;
      } catch (err) {
        console.warn("Website analysis error:", err);
      }
    }

    // 3. Build live dynamic knowledge prompt
    let systemPrompt = buildPortfolioKnowledgePrompt(cmsData);
    if (websitePromptSnippet) {
      systemPrompt += websitePromptSnippet;
    }

    // 4. Check for Gemini API key (server-side only)
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      // Graceful dynamic fallback engine using the live CMS data
      const fallbackReply = generateSmartFallbackReply(lastUserMessage, cmsData, {
        hasImage: !!validImage,
        referenceUrl: referenceUrl || undefined,
        documentName: validDocument?.name,
      });
      return NextResponse.json({
        success: true,
        message: fallbackReply,
        source: "dynamic-knowledge-engine",
      });
    }

    // 5. Transform messages into Gemini Multimodal API format
    const contents = messages.map((m, idx) => {
      const isLast = idx === messages.length - 1;
      const parts: any[] = [{ text: m.content }];

      // Attach uploaded image to the current user query if present
      if (isLast && m.role === "user" && validImage) {
        parts.push({
          inlineData: {
            mimeType: validImage.mimeType,
            data: validImage.data,
          },
        });
      }

      // Attach document content or transparent notice to the current user query if present
      if (isLast && m.role === "user" && validDocument) {
        if (validDocument.textContent) {
          parts.push({
            text: `\n\n[USER ATTACHED TEXT DOCUMENT: "${validDocument.name}" (${(validDocument.size / 1024).toFixed(1)} KB)]\nDOCUMENT CONTENTS:\n${validDocument.textContent}\n`,
          });
        } else {
          parts.push({
            text: `\n\n[USER ATTACHED FILE: "${validDocument.name}" (${(validDocument.size / 1024).toFixed(1)} KB) (${validDocument.mimeType})]\n(Note: Binary document. Please inform the visitor that Tarek will review the full document directly, and invite them to summarize requirements or connect on WhatsApp.)`,
          });
        }
      }

      return {
        role: m.role,
        parts,
      };
    });

    // Cascade of active, currently supported Gemini models in priority order
    const CANDIDATE_MODELS = [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
      "gemini-3.5-flash",
    ];

    const callGeminiModel = async (modelName: string): Promise<string> => {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.3, // Optimal balance of high factual accuracy and natural conversational warmth
            maxOutputTokens: 600, // Keeps answers concise and prevents long rambling walls of text
          },
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[AI Chat API] Gemini model [${modelName}] HTTP error (${res.status}):`, errText);
        throw new Error(`Gemini API [${modelName}] error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts;
      const candidateText = Array.isArray(parts)
        ? parts.find((p: any) => typeof p.text === "string" && !p.thought)?.text ||
          parts.find((p: any) => typeof p.text === "string")?.text
        : null;

      if (!candidateText || typeof candidateText !== "string") {
        throw new Error(`Invalid response format from Gemini API [${modelName}]`);
      }

      return candidateText;
    };

    // Attempt calling Gemini models in order of priority
    for (const model of CANDIDATE_MODELS) {
      try {
        const aiReply = await callGeminiModel(model);
        console.log(`[AI Chat API] Successfully generated response via model: ${model}`);
        return NextResponse.json({
          success: true,
          message: aiReply,
          model,
          source: "gemini-ai",
          hasImageAnalyzed: !!validImage,
          referenceUrl: referenceUrl || undefined,
        });
      } catch (err: any) {
        console.warn(`[AI Chat API] Gemini model ${model} failed, trying next candidate:`, err?.message?.substring(0, 200));
      }
    }

    // 6. Fallback if all Gemini models are unavailable or rate-limited
    console.error("[AI Chat API] All Gemini API attempts exhausted or unavailable. Triggering dynamic knowledge fallback engine.");
    const fallbackReply = generateSmartFallbackReply(lastUserMessage, cmsData, {
      hasImage: !!validImage,
      referenceUrl: referenceUrl || undefined,
    });
    return NextResponse.json({
      success: true,
      message: fallbackReply,
      source: "dynamic-knowledge-engine",
    });
  } catch (error: any) {
    console.error("Chat API route unexpected error:", error);
    try {
      const cmsData = await getCmsData();
      const fallbackReply = generateSmartFallbackReply("hello", cmsData);
      return NextResponse.json({
        success: true,
        message: fallbackReply,
      });
    } catch {
      return NextResponse.json(
        {
          success: true,
          message:
            "Sorry! The AI Assistant is temporarily experiencing high traffic. Please reach out to Tarek directly at 01733119269 or 01840019449! 😊",
        },
        { status: 200 }
      );
    }
  }
}

