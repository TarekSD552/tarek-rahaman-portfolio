/**
 * ============================================================================
 * WEBSITE LINK ANALYZER — SAFE REFERENCE URL PARSING FOR AI ASSISTANT
 * ============================================================================
 * 
 * Safely fetches metadata, page title, OpenGraph description, and structural
 * headings from user-provided reference websites so the AI can give accurate
 * design & technical assessments without hallucinating.
 */

export interface AnalyzedWebsiteData {
  success: boolean;
  url: string;
  domain: string;
  title?: string;
  description?: string;
  siteName?: string;
  headingsSample?: string[];
  error?: string;
}

/**
 * Validates that a URL points to a safe public internet target.
 * Defends against Server-Side Request Forgery (SSRF) to internal network & cloud metadata.
 */
function isSafePublicUrl(parsedUrl: URL): boolean {
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return false;
  }

  const host = parsedUrl.hostname.toLowerCase();

  // Block localhost, loopbacks, and zero addresses
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host === "[::1]" ||
    host.startsWith("127.")
  ) {
    return false;
  }

  // Block cloud metadata services (e.g. AWS, GCP, Azure, DigitalOcean)
  if (host === "169.254.169.254" || host.startsWith("169.254.")) {
    return false;
  }

  // Block private RFC1918 subnets
  if (
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
  ) {
    return false;
  }

  // Block local/internal TLDs
  if (
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".lan") ||
    host.endsWith(".corp") ||
    host.endsWith(".home")
  ) {
    return false;
  }

  return true;
}

/**
 * Extracts the first valid external HTTP/HTTPS URL from a text message.
 * Excludes internal site paths, WhatsApp links, mailto, and common social sharing links.
 */
export function extractReferenceUrl(text: string): string | null {
  if (!text || typeof text !== "string") return null;

  // Regex matching http/https URLs
  const urlMatch = text.match(/https?:\/\/[^\s<>)\]"]+/i);
  if (!urlMatch) return null;

  const rawUrl = urlMatch[0].replace(/[.,;:!?)]+$/, "");

  try {
    const parsed = new URL(rawUrl);
    if (!isSafePublicUrl(parsed)) {
      return null;
    }
  } catch {
    return null;
  }

  // Exclude internal paths, WhatsApp, telephone, and mailto
  const lower = rawUrl.toLowerCase();
  if (
    lower.includes("wa.me") ||
    lower.includes("whatsapp.com") ||
    lower.includes("mailto:") ||
    lower.includes("tel:") ||
    lower.includes("tarekrahaman.com")
  ) {
    return null;
  }

  return rawUrl;
}

/**
 * Safely fetches public website metadata with strict timeouts and safety boundaries.
 */
export async function analyzeReferenceWebsite(
  url: string
): Promise<AnalyzedWebsiteData> {
  let domain = "";
  let parsed: URL;
  try {
    parsed = new URL(url);
    domain = parsed.hostname.replace(/^www\./, "");
  } catch {
    return {
      success: false,
      url,
      domain: url,
      error: "Invalid URL structure",
    };
  }

  if (!isSafePublicUrl(parsed)) {
    return {
      success: false,
      url,
      domain,
      error: "Access to private or local network targets is restricted for security.",
    };
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(3500),
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        success: false,
        url,
        domain,
        error: `HTTP ${response.status} ${response.statusText}`,
      };
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return {
        success: false,
        url,
        domain,
        error: "Resource is not an HTML webpage",
      };
    }

    // Read initial 60KB only to prevent memory bloat on large pages
    const reader = response.body?.getReader();
    let htmlChunk = "";
    if (reader) {
      const decoder = new TextDecoder("utf-8");
      let totalBytes = 0;
      const maxBytes = 65536; // 64KB

      while (true) {
        const { done, value } = await reader.read();
        if (done || !value) break;
        htmlChunk += decoder.decode(value, { stream: true });
        totalBytes += value.length;
        if (totalBytes >= maxBytes) {
          reader.cancel();
          break;
        }
      }
    } else {
      htmlChunk = await response.text();
      htmlChunk = htmlChunk.slice(0, 65536);
    }

    // Extract Title
    const titleMatch = htmlChunk.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    // Extract Meta Description
    const descMatch =
      htmlChunk.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
      ) ||
      htmlChunk.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i
      ) ||
      htmlChunk.match(
        /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
      );
    const description = descMatch ? descMatch[1].trim() : undefined;

    // Extract OpenGraph Site Name or Title
    const siteNameMatch = htmlChunk.match(
      /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i
    );
    const siteName = siteNameMatch ? siteNameMatch[1].trim() : undefined;

    // Extract top H1 / H2 headings for layout structure
    const headings: string[] = [];
    const headingMatches = htmlChunk.matchAll(/<h[1-2][^>]*>([^<]+)<\/h[1-2]>/gi);
    for (const match of headingMatches) {
      const text = match[1]?.trim();
      if (text && text.length > 3 && text.length < 80 && !headings.includes(text)) {
        headings.push(text);
      }
      if (headings.length >= 4) break;
    }

    return {
      success: true,
      url,
      domain,
      title: title || domain,
      description: description || "No meta description provided.",
      siteName: siteName || domain,
      headingsSample: headings.length ? headings : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      url,
      domain,
      error: err?.message?.includes("timed out")
        ? "Access timed out"
        : "Remote website protected or unreachable",
    };
  }
}

/**
 * Builds the prompt instructions to guide the AI when a reference website is detected.
 */
export function buildWebsiteAnalysisPrompt(data: AnalyzedWebsiteData): string {
  if (data.success) {
    return `
======================================================
VISITOR REFERENCE WEBSITE ANALYSIS (${data.domain}):
======================================================
The visitor provided a reference website: ${data.url}
ACCESSED METADATA & STRUCTURE:
- Title: ${data.title || "N/A"}
- Description: ${data.description || "N/A"}
- Site/Brand Name: ${data.siteName || data.domain}
${data.headingsSample?.length ? `- Visible Key Headings: ${data.headingsSample.join(" | ")}` : ""}

INSTRUCTIONS FOR WEBSITE ANALYSIS:
1. Confirm to the visitor that Tarek can build a website inspired by this reference (${data.domain}).
2. Explain the general type of website (e.g., e-commerce, corporate, SaaS, portfolio).
3. Mention key components & features needed (e.g., modern responsive layout, interactive sections, CMS/admin, payment gateway if e-commerce).
4. Recommend an appropriate technology stack from Tarek's skills (e.g., Next.js/React + Tailwind or WordPress/WooCommerce).
5. Provide an estimated timeline and budget range using Tarek's Smart Pricing Rules.
6. Clearly state that this is an inspired custom build, and invite them to share specific pages they like.
`.trim();
  }

  // When website could not be accessed directly
  return `
======================================================
VISITOR REFERENCE WEBSITE ACCESS NOTICE (${data.domain}):
======================================================
The visitor provided a reference website: ${data.url}
STATUS: Could NOT access or inspect the remote website directly (${data.error || "Access restricted"}).

CRITICAL INSTRUCTION (DO NOT HALLUCINATE):
1. Be completely honest with the visitor. State:
   "I can definitely help Tarek create a website inspired by this reference (${data.domain}). However, I could not directly access or inspect this specific link due to external security or network restrictions. If you describe the key sections you love or upload a quick screenshot, I can provide a very accurate timeline and budget estimate!"
2. Never invent fake pages or claims about this link that were not verified.
`.trim();
}

