import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

/**
 * Object storage (AD-B7-03). Files live in Vercel Blob when BLOB_READ_WRITE_TOKEN
 * is set (production), otherwise in public/uploads (local dev). The database
 * only ever stores the returned URL + key — never file bytes.
 */
export type StoredObject = { url: string; key: string };

const LOCAL_ROOT = path.join(process.cwd(), "public", "uploads");

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || undefined;
}

function localPath(key: string): string | null {
  const resolved = path.resolve(LOCAL_ROOT, key);
  return resolved.startsWith(LOCAL_ROOT + path.sep) ? resolved : null;
}

export function storageDriver(): "blob" | "local" {
  return blobToken() ? "blob" : "local";
}

/** Keys must be unique per upload (uuid-based) — objects are immutable once written. */
export async function putObject(
  key: string,
  bytes: Buffer,
  contentType: string,
): Promise<StoredObject> {
  const token = blobToken();
  if (token) {
    const blob = await put(key, bytes, { access: "public", contentType, token });
    return { url: blob.url, key };
  }
  const target = localPath(key);
  if (!target) throw new Error(`Invalid storage key: ${key}`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return { url: `/uploads/${key}`, key };
}

/** Best-effort delete; a missing object is not an error. */
export async function deleteObjects(objects: StoredObject[]): Promise<void> {
  if (objects.length === 0) return;
  const token = blobToken();
  const blobUrls = objects.map((o) => o.url).filter((u) => u.startsWith("http"));
  if (token && blobUrls.length > 0) {
    await del(blobUrls, { token }).catch((err) => {
      console.error("[storage] blob delete failed", err);
    });
  }
  for (const o of objects) {
    if (!o.url.startsWith("/uploads/")) continue;
    const target = localPath(o.key);
    if (target) await unlink(target).catch(() => undefined);
  }
}
