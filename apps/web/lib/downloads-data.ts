/**
 * Downloads seed/fallback for Epic E11 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers later.
 */

import {
  SEED_CATEGORIES,
  SEED_DOCUMENTS,
  type SeedDocument,
} from "./downloads-seed";

export type DocumentCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PublicDocument = {
  id: string;
  title: string;
  description: string | null;
  category: DocumentCategory | null;
  fileType: string;
  byteSize: number;
  publishedAt: string | null;
  downloadPath: string;
  fileName: string;
};

export type DocumentsPage = {
  items: PublicDocument[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

function toPublic(row: SeedDocument): PublicDocument {
  const category =
    SEED_CATEGORIES.find((item) => item.slug === row.categorySlug) ?? null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: category
      ? { id: category.id, name: category.name, slug: category.slug }
      : null,
    fileType: row.fileType,
    byteSize: row.byteSize,
    publishedAt: row.publishedAt,
    downloadPath: row.downloadPath,
    fileName: row.fileName,
  };
}

const published = [...SEED_DOCUMENTS]
  .map(toPublic)
  .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

export function formatDocumentDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Kampala",
  }).format(date);
}

/** Categories that currently have published documents. */
export async function listDocumentCategories(): Promise<DocumentCategory[]> {
  const used = new Set(
    published.map((doc) => doc.category?.slug).filter(Boolean) as string[],
  );
  return SEED_CATEGORIES.filter((category) => used.has(category.slug)).map(
    ({ id, name, slug }) => ({ id, name, slug }),
  );
}

export async function listDocumentsPage(request: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
} = {}): Promise<DocumentsPage> {
  const pageSize = Math.min(Math.max(Math.floor(request.pageSize ?? 12) || 12, 1), 100);
  const categorySlug = request.categorySlug?.trim() || "";
  const filtered = categorySlug
    ? published.filter((doc) => doc.category?.slug === categorySlug)
    : published;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.max(Math.floor(Number(request.page)) || 1, 1), pageCount);
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    page,
    pageSize,
    total: filtered.length,
    pageCount,
  };
}

/** Latest published docs for home / footer / programme blocks. */
export async function listLatestDocuments(limit = 4): Promise<PublicDocument[]> {
  return published.slice(0, Math.min(Math.max(limit, 1), 100));
}

export function toLatestDownloadItem(doc: PublicDocument) {
  return {
    id: doc.id,
    title: doc.title,
    href: doc.downloadPath,
    byteSize: doc.byteSize,
    fileType: doc.fileType,
  };
}
