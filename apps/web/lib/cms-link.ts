/** Empty, site-relative (`/…`), or http(s) absolute URL. */
export function parseOptionalHref(
  raw: string,
): { ok: true; value: string | null } | { ok: false } {
  const value = raw.trim();
  if (!value) return { ok: true, value: null };
  if (value.startsWith("/") && !value.startsWith("//")) {
    return { ok: true, value: value.slice(0, 500) };
  }
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return { ok: true, value: url.toString().slice(0, 500) };
    }
  } catch {
    /* fall through */
  }
  return { ok: false };
}
