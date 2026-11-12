import { NextRequest, NextResponse } from "next/server";
import https from "node:https";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

/**
 * Splits text into natural sentence/phrase chunks under maxLen characters
 * so that Google TTS (which caps requests at ~150-200 chars) processes each part smoothly.
 */
function splitTextIntoChunks(text: string, maxLen = 120): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  // Match sentences ending with punctuation (Bangla danda ।, ?, !, ., newline) or end of string
  const sentences = clean.match(/[^।?!.\n\r]+[।?!.\n\r]*/g) || [clean];
  const chunks: string[] = [];
  let buffer = "";

  for (const part of sentences) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if ((buffer + " " + trimmed).trim().length <= maxLen) {
      buffer = (buffer + " " + trimmed).trim();
    } else {
      if (buffer) chunks.push(buffer);
      if (trimmed.length <= maxLen) {
        buffer = trimmed;
      } else {
        const words = trimmed.split(" ");
        let wordBuf = "";
        for (const w of words) {
          if ((wordBuf + " " + w).trim().length <= maxLen) {
            wordBuf = (wordBuf + " " + w).trim();
          } else {
            if (wordBuf) chunks.push(wordBuf);
            wordBuf = w;
          }
        }
        buffer = wordBuf;
      }
    }
  }
  if (buffer) chunks.push(buffer);
  // Cap at 8 chunks (~800-1000 characters) for responsive audio streaming
  return chunks.slice(0, 8);
}

/**
 * Fetches an MP3 audio chunk from Google Translate TTS service.
 */
function fetchTtsChunk(text: string, lang = "bn"): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
      lang
    )}&client=tw-ob&q=${encodeURIComponent(text)}`;

    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
        timeout: 8000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(
            new Error(`Google TTS responded with status code ${res.statusCode}`)
          );
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Google TTS request timed out"));
    });
  });
}

export async function GET(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, {
      scope: "tts-audio",
      limit: 30,
      windowMs: 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many TTS requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds || 10) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawText = (searchParams.get("text") || "").slice(0, 1500);
    const lang = (searchParams.get("lang") || "bn").slice(0, 10);

    // Clean text: strip markdown characters, URLs, and extra spaces
    const cleanText = rawText
      .replace(/[*_#`~>\[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      return NextResponse.json(
        { error: "Text parameter is required" },
        { status: 400 }
      );
    }

    const chunks = splitTextIntoChunks(cleanText, 120);
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "No speakable text found" },
        { status: 400 }
      );
    }

    // Fetch all audio chunks in parallel
    const audioBuffers = await Promise.all(
      chunks.map((chunk) => fetchTtsChunk(chunk, lang))
    );

    // Concatenate the MP3 binary buffers into a single audio file
    const combinedBuffer = Buffer.concat(audioBuffers);

    return new Response(combinedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combinedBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error: any) {
    console.error("[TTS API Route Error]:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to generate speech audio", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, {
      scope: "tts-audio",
      limit: 30,
      windowMs: 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many TTS requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds || 10) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawText = (typeof body.text === "string" ? body.text : "").slice(0, 1500);
    const lang = (typeof body.lang === "string" ? body.lang : "bn").slice(0, 10);

    const cleanText = rawText
      .replace(/[*_#`~>\[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      return NextResponse.json(
        { error: "Text parameter is required" },
        { status: 400 }
      );
    }

    const chunks = splitTextIntoChunks(cleanText, 120);
    const audioBuffers = await Promise.all(
      chunks.map((chunk) => fetchTtsChunk(chunk, lang))
    );

    const combinedBuffer = Buffer.concat(audioBuffers);

    return new Response(combinedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combinedBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error: any) {
    console.error("[TTS API Route Error]:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to generate speech audio", details: error?.message },
      { status: 500 }
    );
  }
}

