import { NextResponse } from "next/server";
import {
  generateAdminSessionToken,
  timingSafeCompare,
} from "@/lib/admin-auth";
import {
  checkRateLimit,
  getClientIp,
  resetRateLimit,
} from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate Limiting: Max 5 failed attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(clientIp, {
      scope: "admin-login",
      limit: 5,
      windowMs: 15 * 60 * 1000,
      blockDurationMs: 15 * 60 * 1000,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateCheck.retryAfterSeconds || 60} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds || 60),
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    const expectedPass = process.env.ADMIN_PASSWORD || "TarekR9414@";

    // 2. Timing-safe comparison prevents side-channel timing attacks
    const isUserValid = timingSafeCompare(username, expectedUser);
    const isPassValid = timingSafeCompare(password, expectedPass);

    if (isUserValid && isPassValid) {
      // Clear rate limit record on successful login
      resetRateLimit(clientIp, "admin-login");

      const isHttps =
        request.headers.get("x-forwarded-proto") === "https" ||
        request.url.startsWith("https:");

      // Generate cryptographically signed HMAC token
      const token = generateAdminSessionToken(expectedUser, "Administrator");

      const response = NextResponse.json(
        {
          success: true,
          message: "Authentication successful",
          token,
          session: {
            authenticated: true,
            user: expectedUser,
            role: "Administrator",
            loggedInAt: new Date().toISOString(),
          },
        },
        { status: 200 }
      );

      // Set secure HTTP-only session cookie
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: isHttps,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid username or password",
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during authentication. Please try again.",
      },
      { status: 500 }
    );
  }
}
