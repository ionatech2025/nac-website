import sharp from "sharp";

/** Card/gallery thumbnails and a lightbox/hero size (AD-B7-03). */
export const IMAGE_VARIANTS = {
  thumb: { width: 480, quality: 72 },
  medium: { width: 1280, quality: 80 },
} as const;

export type ImageVariantName = keyof typeof IMAGE_VARIANTS;

export type ProcessedImage = {
  width: number;
  height: number;
  variants: Record<ImageVariantName, Buffer>;
};

async function renderVariant(bytes: Buffer, name: ImageVariantName) {
  const { width, quality } = IMAGE_VARIANTS[name];
  return sharp(bytes)
    .rotate()
    .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
}

/**
 * Reads dimensions and renders WebP variants. Variants are re-encoded, so EXIF
 * (including GPS) is stripped from them. Returns null if the bytes don't decode.
 */
export async function processImage(bytes: Buffer): Promise<ProcessedImage | null> {
  try {
    const meta = await sharp(bytes).metadata();
    if (!meta.width || !meta.height) return null;
    const swap = (meta.orientation ?? 1) >= 5;
    const [thumb, medium] = await Promise.all([
      renderVariant(bytes, "thumb"),
      renderVariant(bytes, "medium"),
    ]);
    return {
      width: swap ? meta.height : meta.width,
      height: swap ? meta.width : meta.height,
      variants: { thumb, medium },
    };
  } catch {
    return null;
  }
}
