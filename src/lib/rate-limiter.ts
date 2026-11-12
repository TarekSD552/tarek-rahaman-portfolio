/**
 * In-memory sliding-window rate limiter for sensitive endpoints.
 * Automatically purges stale IP records to keep memory bounded.
 */

interface RateLimitRecord {
  timestamps: number[];
  blockedUntil?: number;
}

const rateLimitStores: Map<string, Map<string, RateLimitRecord>> = new Map();

function getStore(scope: string): Map<string, RateLimitRecord> {
  let store = rateLimitStores.get(scope);
  if (!store) {
    store = new Map();
    rateLimitStores.set(scope, store);
  }
  return store;
}

/**
 * Extracts client IP address from standard proxy/CDN headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

export interface RateLimitOptions {
  scope: string;
  limit: number;
  windowMs: number;
  blockDurationMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetMs: number;
  retryAfterSeconds?: number;
}

/**
 * Evaluates rate limit for a given request and identifier.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const store = getStore(options.scope);
  let record = store.get(identifier);

  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Check if currently blocked
  if (record.blockedUntil && record.blockedUntil > now) {
    const remainingBlockMs = record.blockedUntil - now;
    return {
      success: false,
      remaining: 0,
      resetMs: remainingBlockMs,
      retryAfterSeconds: Math.ceil(remainingBlockMs / 1000),
    };
  }

  // Purge timestamps older than the window
  const windowStart = now - options.windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.limit) {
    if (options.blockDurationMs) {
      record.blockedUntil = now + options.blockDurationMs;
    }
    const oldest = record.timestamps[0];
    const resetMs = oldest + options.windowMs - now;
    return {
      success: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
      retryAfterSeconds: Math.ceil(Math.max(1000, resetMs) / 1000),
    };
  }

  // Register current hit
  record.timestamps.push(now);

  // Periodically clean up idle records (store size cap)
  if (store.size > 2000) {
    for (const [key, val] of store.entries()) {
      if (
        (!val.blockedUntil || val.blockedUntil < now) &&
        val.timestamps.every((ts) => ts < windowStart)
      ) {
        store.delete(key);
      }
    }
  }

  return {
    success: true,
    remaining: options.limit - record.timestamps.length,
    resetMs: options.windowMs,
  };
}

/**
 * Clears failed attempt tracking for a specific identifier (e.g. after successful login).
 */
export function resetRateLimit(identifier: string, scope: string): void {
  const store = rateLimitStores.get(scope);
  if (store) {
    store.delete(identifier);
  }
}

