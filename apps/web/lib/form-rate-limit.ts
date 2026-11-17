/**
 * Fixed-window, in-memory rate limit for public form submissions (E12-05, B9-05).
 * Per server instance; swap for Redis/Upstash if we scale to many instances.
 * Keys are never persisted or linked to stored submissions.
 */

type Window = { count: number; startedAt: number };

export type RateLimitPolicy = { max: number; windowMs: number };

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

const windows = new Map<string, Window>();

export function consumeRateLimit(
  key: string,
  policy: RateLimitPolicy,
): RateLimitResult {
  const now = Date.now();
  if (windows.size > 5000) pruneExpired(now, policy.windowMs);

  const current = windows.get(key);
  if (!current || now - current.startedAt >= policy.windowMs) {
    windows.set(key, { count: 1, startedAt: now });
    return { allowed: true, remaining: policy.max - 1 };
  }

  if (current.count >= policy.max) {
    const retryMs = policy.windowMs - (now - current.startedAt);
    return { allowed: false, retryAfterSeconds: Math.ceil(retryMs / 1000) };
  }

  current.count += 1;
  return { allowed: true, remaining: policy.max - current.count };
}

function pruneExpired(now: number, windowMs: number) {
  for (const [key, w] of windows) {
    if (now - w.startedAt >= windowMs) windows.delete(key);
  }
}

export const INQUIRY_RATE_LIMIT: RateLimitPolicy = {
  max: 5,
  windowMs: 10 * 60 * 1000,
};
