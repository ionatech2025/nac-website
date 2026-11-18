import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

/**
 * Object storage (AD-B7-03). Prefer Vercel Blob; fall back to public/uploads
 * only for local `npm run dev`.
 *
 * Auth on Vercel (2025+): connecting a Blob store injects `BLOB_STORE_ID` +
 * OIDC (`VERCEL_OIDC_TOKEN`). The SDK picks those up automatically — you do
 * NOT need the quickstart snippet, and you often will NOT have
 * `BLOB_READ_WRITE_TOKEN` unless you ticked “Add a read-write token”.
 * Our older code only checked that token, so production kept writing to disk
 * → ENOENT mkdir …/public on Vercel’s read-only filesystem.
 *
 * Store access must be **Public**: team photos and article images are shown
 * with plain <img src="…">. A Private store cannot be switched later — create
 * a new Public store if you chose Private by mistake.
 */
export type StoredObject = { url: string; key: string };

const LOCAL_ROOT = path.join(process.cwd(), "public", "uploads");

function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || undefined;
}

/** True when a Blob store is wired (OIDC on Vercel and/or a read-write token). */
export function blobConfigured(): boolean {
  return Boolean(blobToken() || process.env.BLOB_STORE_ID);
}

export function storageDriver(): "blob" | "local" {
  return blobConfigured() ? "blob" : "local";
}

function localPath(key: string): string | null {
  const resolved = path.resolve(LOCAL_ROOT, key);
  return resolved.startsWith(LOCAL_ROOT + path.sep) ? resolved : null;
}

/** Keys must be unique per upload (uuid-based) — objects are immutable once written. */
export async function putObject(
  key: string,
  bytes: Buffer,
  contentType: string,
): Promise<StoredObject> {
  if (blobConfigured()) {
    const token = blobToken();
    // Omit `token` when unset so the SDK uses OIDC (BLOB_STORE_ID + VERCEL_OIDC_TOKEN).
    const blob = await put(key, bytes, {
      access: "public",
      contentType,
      ...(token ? { token } : {}),
    });
    return { url: blob.url, key };
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Blob storage is not connected. In Vercel: Storage → Blob → connect this project (Public store). Redeploy after connecting.",
    );
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
  if (blobConfigured()) {
    const token = blobToken();
    const blobUrls = objects.map((o) => o.url).filter((u) => u.startsWith("http"));
    if (blobUrls.length > 0) {
      await del(blobUrls, token ? { token } : {}).catch((err) => {
        console.error("[storage] blob delete failed", err);
      });
    }
  }
  for (const o of objects) {
    if (!o.url.startsWith("/uploads/")) continue;
    const target = localPath(o.key);
    if (target) await unlink(target).catch(() => undefined);
  }
}
