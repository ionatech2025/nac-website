export type AllowedVideoProvider = "YOUTUBE" | "VIMEO";

export type ParsedVideoLink =
  | { ok: true; provider: AllowedVideoProvider; url: string; id: string }
  | { ok: false; error: "empty" | "unsupported" };

const YT_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

function youtubeId(pathname: string, search: URLSearchParams): string | null {
  if (pathname === "/watch") return search.get("v");
  const embed = pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{6,})/);
  if (embed) return embed[1] ?? null;
  const short = pathname.match(/^\/([A-Za-z0-9_-]{6,})$/);
  return short?.[1] ?? null;
}

function vimeoId(pathname: string): string | null {
  const match = pathname.match(/\/(?:video\/)?(\d{6,})/);
  return match?.[1] ?? null;
}

/** Parse YouTube/Vimeo URL into provider + canonical watch URL (E10-04). */
export function parseVideoUrl(raw: string): ParsedVideoLink {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "empty" };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "unsupported" };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: "unsupported" };
  }

  const host = parsed.hostname.toLowerCase();

  if (YT_HOSTS.has(host)) {
    const id = youtubeId(parsed.pathname, parsed.searchParams);
    if (!id) return { ok: false, error: "unsupported" };
    return {
      ok: true,
      provider: "YOUTUBE",
      id,
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  if (VIMEO_HOSTS.has(host)) {
    const id = vimeoId(parsed.pathname);
    if (!id) return { ok: false, error: "unsupported" };
    return {
      ok: true,
      provider: "VIMEO",
      id,
      url: `https://vimeo.com/${id}`,
    };
  }

  return { ok: false, error: "unsupported" };
}

export function videoProviderErrorMessage(
  error: "empty" | "unsupported" | string,
): string {
  if (error === "empty") return "A video URL is required.";
  return "Use a YouTube or Vimeo link only (no embed HTML).";
}
