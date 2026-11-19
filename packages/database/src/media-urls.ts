/**
 * Public URL helpers (AD-B7-03). Storage URLs (Vercel Blob or /uploads) change
 * when a file is replaced; these give the site stable links and sized images.
 */

/** Media fields public pages need to render an image at the right size. */
export const PUBLIC_IMAGE_SELECT = {
  url: true,
  altText: true,
  thumbUrl: true,
  mediumUrl: true,
  width: true,
  height: true,
} as const;

export type ImageSize = "thumb" | "medium" | "original";

export type SizedMedia = {
  url: string;
  thumbUrl?: string | null;
  mediumUrl?: string | null;
};

/** Best URL for a size; falls back to the original for assets without variants. */
export function mediaVariantUrl(media: SizedMedia, size: ImageSize): string {
  if (size === "thumb") return media.thumbUrl ?? media.mediumUrl ?? media.url;
  if (size === "medium") return media.mediumUrl ?? media.url;
  return media.url;
}

/** Permanent public link for a document; survives the PDF being replaced. */
export function documentDownloadPath(documentId: string): string {
  return `/downloads/${documentId}`;
}
