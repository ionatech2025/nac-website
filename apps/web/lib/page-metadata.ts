import type { Metadata } from "next";
import { absoluteUrl, siteOrigin } from "./share-links";

export const SITE_NAME = "Network for Active Citizens";
export const DEFAULT_DESCRIPTION =
  "NAC is a network of youth organisations in Uganda building resilience through capability development and policy outreach.";

type ImageMeta = { url: string; alt?: string };

type Options = {
  title: string;
  description?: string | null;
  path: string;
  /** Use absolute title (no "| NAC" template), e.g. homepage. */
  absoluteTitle?: boolean;
  image?: ImageMeta | null;
  type?: "website" | "article";
  /** When true, discourage indexing (complaints, etc.). */
  noIndex?: boolean;
};

/** Shared public-page metadata: title, description, canonical, OG/Twitter. */
export function publicPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
  type = "website",
  noIndex = false,
}: Options): Metadata {
  const desc = description?.trim() || DEFAULT_DESCRIPTION;
  const url = absoluteUrl(path);
  const images = image
    ? [{ url: image.url, alt: image.alt ?? title }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE_NAME,
      type,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: desc,
      images: image ? [image.url] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function rootMetadataBase(): URL {
  return new URL(`${siteOrigin()}/`);
}
