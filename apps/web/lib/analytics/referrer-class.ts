export type ReferrerClass = "direct" | "search" | "social" | "other";

const SEARCH_HOSTS = [
  "google.",
  "bing.",
  "yahoo.",
  "duckduckgo.",
  "baidu.",
  "yandex.",
];

const SOCIAL_HOSTS = [
  "facebook.",
  "fb.",
  "instagram.",
  "twitter.",
  "x.com",
  "t.co",
  "linkedin.",
  "tiktok.",
  "youtube.",
  "youtu.be",
  "reddit.",
  "pinterest.",
];

function hostMatches(host: string, needles: string[]): boolean {
  return needles.some(
    (n) => host === n || host.endsWith(n) || host.includes(n),
  );
}

export function classifyReferrerHost(
  referrerHost: string | null | undefined,
): ReferrerClass {
  if (!referrerHost) return "direct";
  const host = referrerHost.toLowerCase();
  if (hostMatches(host, SEARCH_HOSTS)) return "search";
  if (hostMatches(host, SOCIAL_HOSTS)) return "social";
  return "other";
}
