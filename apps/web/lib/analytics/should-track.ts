const BOT_UA =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|redditbot|ahrefs|semrush|petalbot|bytespider/i;

const SKIP_PREFIXES = ["/admin", "/login", "/api"];

export function shouldTrackPath(path: string): boolean {
  const lower = path.toLowerCase();
  if (SKIP_PREFIXES.some((p) => lower === p || lower.startsWith(`${p}/`))) {
    return false;
  }
  if (lower.includes("complaint")) {
    return false;
  }
  return true;
}

export function isLikelyBot(userAgent: string): boolean {
  if (!userAgent.trim()) return true;
  return BOT_UA.test(userAgent);
}

export const DEDUPE_WINDOW_MS = 30_000;
