/**
 * Simple in-memory rate limiter for server actions.
 *
 * Limits requests per IP (or identifier) within a sliding window.
 * Resets after the window expires. Suitable for single-instance
 * deployments (Railway single container). For multi-instance, swap
 * with Redis-backed implementation.
 */

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request is rate limited.
 *
 * @param identifier - IP address or other identifier
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns `{ limited: true }` if rate limited, `{ limited: false }` if allowed
 */
export function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number,
): { limited: boolean; remaining: number; resetTime: number } {
  cleanup();
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return {
      limited: false,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (entry.count >= maxRequests) {
    return { limited: true, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return {
    limited: false,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/** Default rate limit for form submissions: 5 per 10 minutes */
export const FORM_RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 10 * 60 * 1000,
};
