import { randomUUID } from "node:crypto";
import { prisma } from "@repo/database";
import { processImage } from "./image-variants";
import {
  ALLOWED_IMAGE_MIME,
  isAllowedImageMime,
  MAX_UPLOAD_BYTES,
} from "./media-limits";
import { putObject } from "./storage";

export type ImageUploadError = "missing" | "type" | "size" | "invalid";

export type ImageUploadResult =
  | { ok: true; mediaId: string; url: string }
  | { ok: false; error: ImageUploadError };

function extensionFor(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

async function sniffImageMime(
  bytes: Uint8Array,
  declared: string,
): Promise<string | null> {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return isAllowedImageMime(declared) ? declared : null;
}

/**
 * Validates and stores an image plus thumb/medium WebP variants; returns a
 * MediaAsset id. Storage backend is chosen in ./storage (Blob or public/uploads).
 */
export async function saveImageUpload(
  file: File | null,
  folder: string,
  options?: { required?: boolean },
): Promise<ImageUploadResult> {
  if (!file || file.size === 0) {
    return options?.required
      ? { ok: false, error: "missing" }
      : { ok: false, error: "missing" };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "size" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = await sniffImageMime(bytes, file.type);
  if (!mime || !isAllowedImageMime(mime)) {
    return { ok: false, error: "type" };
  }

  const processed = await processImage(bytes);
  if (!processed) {
    return { ok: false, error: "invalid" };
  }

  const id = randomUUID();
  const ext = extensionFor(mime);
  const fileName = file.name || `upload.${ext}`;

  const [original, thumb, medium] = await Promise.all([
    putObject(`${folder}/${id}.${ext}`, bytes, mime),
    putObject(`${folder}/${id}-thumb.webp`, processed.variants.thumb, "image/webp"),
    putObject(`${folder}/${id}-medium.webp`, processed.variants.medium, "image/webp"),
  ]);

  const media = await prisma.mediaAsset.create({
    data: {
      url: original.url,
      storageKey: original.key,
      fileName,
      mimeType: mime,
      byteSize: bytes.byteLength,
      width: processed.width,
      height: processed.height,
      thumbUrl: thumb.url,
      thumbKey: thumb.key,
      mediumUrl: medium.url,
      mediumKey: medium.key,
      altText: null,
    },
  });

  return { ok: true, mediaId: media.id, url: media.url };
}

export function imageUploadErrorMessage(error: ImageUploadError): string {
  switch (error) {
    case "missing":
      return "A profile image is required.";
    case "size":
      return `Image must be ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller.`;
    case "type":
      return `Use JPEG, PNG, or WebP only (${ALLOWED_IMAGE_MIME.join(", ")}).`;
    case "invalid":
      return "That image file looks damaged and could not be read.";
    default:
      return "Could not upload the image.";
  }
}
