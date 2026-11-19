/** Allowlisted video providers only — never render arbitrary embed HTML. */

export type EmbedProvider = "YOUTUBE" | "VIMEO";

export function getSafeEmbedSrc(
  provider: EmbedProvider,
  url: string,
): string | null {
  try {
    const parsed = new URL(url);

    if (provider === "YOUTUBE") {
      const host = parsed.hostname.replace(/^www\./, "");
      if (host !== "youtube.com" && host !== "youtu.be" && host !== "m.youtube.com") {
        return null;
      }

      const id =
        host === "youtu.be"
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get("v");

      if (!id || !/^[a-zA-Z0-9_-]{6,}$/.test(id)) return null;
      return `https://www.youtube-nocookie.com/embed/${id}`;
    }

    if (provider === "VIMEO") {
      const host = parsed.hostname.replace(/^www\./, "");
      if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;

      const match = parsed.pathname.match(/\/(?:video\/)?(\d+)/);
      const id = match?.[1];
      if (!id) return null;
      return `https://player.vimeo.com/video/${id}`;
    }

    return null;
  } catch {
    return null;
  }
}
