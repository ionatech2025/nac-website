/**
 * AD-B1-03 in-memory login rate limit (per process).
 * Fine for a single-admin v1; multi-instance production may need Redis/Upstash later.
 */

const MAX_FAILURES = 5;
const WINDOW_MS = 10 * 60 * 1000; // count failures in 10 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // lock for 15 minutes after threshold

type Bucket = {
  failures: number;
  windowStartedAt: number;
  lockedUntil: number | null;
};

const buckets = new Map<string, Bucket>();

function now() {
  return Date.now();
}

function getBucket(key: string): Bucket {
  const existing = buckets.get(key);
  if (!existing) {
    const created: Bucket = {
      failures: 0,
      windowStartedAt: now(),
      lockedUntil: null,
    };
    buckets.set(key, created);
    return created;
  }

  if (existing.lockedUntil && existing.lockedUntil <= now()) {
    existing.lockedUntil = null;
    existing.failures = 0;
    existing.windowStartedAt = now();
  } else if (
    !existing.lockedUntil &&
    now() - existing.windowStartedAt > WINDOW_MS
  ) {
    existing.failures = 0;
    existing.windowStartedAt = now();
  }

  return existing;
}

export function loginAttemptKey(ip: string, email: string): string {
  return `${ip}|${email.trim().toLowerCase()}`;
}

export function isLoginRateLimited(key: string): boolean {
  const bucket = getBucket(key);
  return Boolean(bucket.lockedUntil && bucket.lockedUntil > now());
}

export function recordFailedLogin(key: string): void {
  const bucket = getBucket(key);
  bucket.failures += 1;
  if (bucket.failures >= MAX_FAILURES) {
    bucket.lockedUntil = now() + LOCKOUT_MS;
  }
}

export function clearFailedLogins(key: string): void {
  buckets.delete(key);
}

/** Exported for learning notes / tests — not secrets. */
export const LOGIN_RATE_LIMIT_POLICY = {
  maxFailures: MAX_FAILURES,
  windowMinutes: WINDOW_MS / 60_000,
  lockoutMinutes: LOCKOUT_MS / 60_000,
} as const;
