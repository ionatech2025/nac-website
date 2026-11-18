import { randomUUID } from "node:crypto";
import { prisma } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "./media-limits";
import { putObject } from "./storage";

export type PdfUploadError = "missing" | "type" | "size";

export type PdfUploadResult =
  | { ok: true; mediaId: string; url: string; byteSize: number }
  | { ok: false; error: PdfUploadError };

function isPdfMagic(bytes: Buffer): boolean {
  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}

/** Validates and stores a PDF; returns MediaAsset id (B7-01 / AD-B3-02). */
export async function savePdfUpload(
  file: File | null,
  folder = "documents",
): Promise<PdfUploadResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: "missing" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "size" };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const declaredOk =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfMagic(bytes) || !declaredOk) {
    return { ok: false, error: "type" };
  }

  const id = randomUUID();
  const fileName = file.name || `document-${id}.pdf`;
  const stored = await putObject(`${folder}/${id}.pdf`, bytes, "application/pdf");

  const media = await prisma.mediaAsset.create({
    data: {
      url: stored.url,
      storageKey: stored.key,
      fileName,
      mimeType: "application/pdf",
      byteSize: bytes.byteLength,
    },
  });

  return {
    ok: true,
    mediaId: media.id,
    url: media.url,
    byteSize: bytes.byteLength,
  };
}

export function pdfUploadErrorMessage(error: PdfUploadError): string {
  switch (error) {
    case "missing":
      return "A PDF file is required.";
    case "size":
      return `PDF must be ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller.`;
    case "type":
      return "Only PDF files are allowed.";
    default:
      return "Could not upload the PDF.";
  }
}
