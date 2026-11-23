/** Absolute URL helpers for social share buttons (E7-03 / E14-03). */

export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://nacuganda.org";
}

export function absoluteUrl(path: string): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${normalised}`;
}

export type ShareTarget = {
  id: string;
  label: string;
  href: string;
};

/** Build share destinations that encode the canonical page URL. */
export function buildShareTargets(
  path: string,
  title: string,
): ShareTarget[] {
  const url = absoluteUrl(path);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];
}
