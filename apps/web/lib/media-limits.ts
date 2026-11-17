/** Shared upload caps (B7 / Q10). */
export const MAX_UPLOAD_BYTES = 2_621_440; // 2.5 MB

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIME)[number];

export function isAllowedImageMime(value: string): value is AllowedImageMime {
  return (ALLOWED_IMAGE_MIME as readonly string[]).includes(value);
}
