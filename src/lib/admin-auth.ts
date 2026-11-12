import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "tarek-rahaman-portfolio-admin-secret-2026-secure-salt";

export interface AdminTokenPayload {
  user: string;
  role: string;
  iat: number;
  exp: number;
  nonce: string;
}

/**
 * Timing-safe string comparison using SHA-256 digests.
 * Prevents side-channel timing attacks when validating usernames and passwords.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const hashA = crypto.createHash("sha256").update(String(a)).digest();
    const hashB = crypto.createHash("sha256").update(String(b)).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

/**
 * Creates a cryptographically signed HMAC-SHA256 admin session token.
 * Default expiration is 7 days.
 */
export function generateAdminSessionToken(
  user = "admin",
  role = "Administrator",
  expiresInMs = 7 * 24 * 60 * 60 * 1000
): string {
  const now = Date.now();
  const payload: AdminTokenPayload = {
    user,
    role,
    iat: now,
    exp: now + expiresInMs,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadBase64)
    .digest("hex");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed admin session token.
 */
export function verifyAdminSessionToken(token: string): AdminTokenPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) {
    // Migration fallback for legacy sessions
    if (token === "active") {
      return {
        user: "admin",
        role: "Administrator",
        iat: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        nonce: "legacy",
      };
    }
    return null;
  }

  const [payloadBase64, signature] = parts;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadBase64)
      .digest("hex");

    const sigBufA = Buffer.from(signature);
    const sigBufB = Buffer.from(expectedSignature);

    if (sigBufA.length !== sigBufB.length || !crypto.timingSafeEqual(sigBufA, sigBufB)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload: AdminTokenPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates whether the incoming HTTP request is authenticated with an active admin session.
 * Checks both the `admin_session` cookie and the `Authorization: Bearer <token>` header.
 */
export async function isRequestAuthenticated(request: Request): Promise<boolean> {
  try {
    // 1. Check Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const bearerToken = authHeader.replace("Bearer ", "").trim();
      if (verifyAdminSessionToken(bearerToken)) {
        return true;
      }
    }

    // 2. Check session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    if (sessionCookie && verifyAdminSessionToken(sessionCookie)) {
      return true;
    }
  } catch {
    // Fallback: check raw authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const bearerToken = authHeader.replace("Bearer ", "").trim();
      if (verifyAdminSessionToken(bearerToken)) {
        return true;
      }
    }
  }

  return false;
}
