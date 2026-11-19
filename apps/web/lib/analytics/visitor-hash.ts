import { createHash } from "node:crypto";

function utcDayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function saltSecret(): string {
  return (
    process.env.ANALYTICS_SALT ||
    process.env.AUTH_SECRET ||
    "local-dev-analytics-salt"
  );
}

/**
 * Daily-rotating visitor hash — not stable across calendar days (B8-03).
 * Raw IP is never stored; only a truncated hashed contribution.
 */
export function buildVisitorHash(input: {
  userAgent: string;
  acceptLanguage: string;
  forwardedFor: string | null;
}): string {
  const ipHint = (input.forwardedFor ?? "unknown")
    .split(",")[0]
    ?.trim()
    .slice(0, 64);
  const material = [
    utcDayKey(),
    saltSecret(),
    input.userAgent.slice(0, 200),
    input.acceptLanguage.slice(0, 80),
    ipHint,
  ].join("|");

  return createHash("sha256").update(material).digest("hex").slice(0, 32);
}
