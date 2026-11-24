/** Friendly label for an org website or social URL (E16 detail). */
export function memberExternalLinkLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("facebook")) return "Facebook";
    if (host.includes("instagram")) return "Instagram";
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("twitter") || host === "x.com") return "X (Twitter)";
    if (host.includes("youtube")) return "YouTube";
    if (host.includes("tiktok")) return "TikTok";
    if (host.includes("wa.me") || host.includes("whatsapp")) return "WhatsApp";
  } catch {
    /* ignore invalid URL — fall through */
  }
  return "Visit organisation website";
}
