import { NextResponse } from "next/server";
import { recordVisitorActivity } from "@/lib/analytics-db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(clientIp, {
      scope: "analytics-track",
      limit: 120,
      windowMs: 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json({ success: false, message: "Rate limit exceeded" }, { status: 429 });
    }
    let payload;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      // Handle sendBeacon text payload
      const text = await request.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = {};
      }
    }

    if (!payload.sessionId || !payload.visitorId || !payload.path) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await recordVisitorActivity({
      sessionId: String(payload.sessionId).trim().slice(0, 100),
      visitorId: String(payload.visitorId).trim().slice(0, 100),
      path: String(payload.path).trim().slice(0, 200),
      pageTitle: payload.pageTitle ? String(payload.pageTitle).slice(0, 120) : undefined,
      scrollDepth: Number(payload.scrollDepth) || 0,
      durationSeconds: Number(payload.durationSeconds) || 0,
      deviceType: payload.deviceType === "Mobile" || payload.deviceType === "Tablet" ? payload.deviceType : "Desktop",
      browser: payload.browser ? String(payload.browser).slice(0, 50) : "Unknown",
      os: payload.os ? String(payload.os).slice(0, 50) : "Unknown",
      referrer: payload.referrer ? String(payload.referrer).slice(0, 250) : "",
      isNewPageView: Boolean(payload.isNewPageView),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Analytics Track API Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

