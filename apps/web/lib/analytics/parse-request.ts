import type { DeviceClass } from "@repo/database";

export type ParsedAnalytics = {
  path: string;
  referrerHost: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  deviceClass: DeviceClass;
  browser: string | null;
  os: string | null;
};

function normalizePath(raw: string): string | null {
  try {
    const path = raw.startsWith("http")
      ? new URL(raw).pathname
      : raw.split("?")[0]?.split("#")[0] || "";
    if (!path.startsWith("/")) return null;
    return path.slice(0, 500);
  } catch {
    return null;
  }
}

export function referrerHostFrom(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return host.slice(0, 200) || null;
  } catch {
    return null;
  }
}

export function parseDeviceClass(ua: string): DeviceClass {
  const u = ua.toLowerCase();
  if (!u) return "UNKNOWN";
  if (/ipad|tablet|kindle|silk|(android(?!.*mobile))/.test(u)) return "TABLET";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(u)) return "MOBILE";
  if (/windows|macintosh|linux|cros/.test(u)) return "DESKTOP";
  return "UNKNOWN";
}

export function parseBrowser(ua: string): string | null {
  if (!ua) return null;
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  if (/firefox\//i.test(ua)) return "Firefox";
  return "Other";
}

export function parseOs(ua: string): string | null {
  if (!ua) return null;
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

export function parseAnalyticsPayload(
  body: { path?: string; referrer?: string | null },
  headers: Headers,
): ParsedAnalytics | null {
  const path = normalizePath(String(body.path ?? ""));
  if (!path) return null;

  const ua = headers.get("user-agent") ?? "";
  return {
    path,
    referrerHost: referrerHostFrom(body.referrer),
    country: headers.get("x-vercel-ip-country"),
    region: headers.get("x-vercel-ip-country-region"),
    city: headers.get("x-vercel-ip-city"),
    deviceClass: parseDeviceClass(ua),
    browser: parseBrowser(ua),
    os: parseOs(ua),
  };
}
