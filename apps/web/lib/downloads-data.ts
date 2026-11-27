/**
 * Downloads (E11) — published documents from `@repo/database`.
 */

import {
  listDocumentCategoriesInUse,
  listPublishedDocuments,
  listPublishedDocumentsPage,
} from "@repo/database";

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

function toPublic(row: {
  id: string;
  title: string;
  description: string | null;
  fileType: string;
  byteSize: number;
  publishedAt: Date | null;
  downloadPath: string;
  category: { id: string; name: string; slug: string } | null;
  media: { fileName: string };
}): PublicDocument {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category
      ? {
          id: row.category.id,
          name: row.category.name,
          slug: row.category.slug,
        }
      : null,
    fileType: row.fileType,
    byteSize: row.byteSize,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    downloadPath: row.downloadPath,
    fileName: row.media.fileName,
  };
}

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

export async function listDocumentCategories(): Promise<DocumentCategory[]> {
  return listDocumentCategoriesInUse();
}

export async function listDocumentsPage(request: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
} = {}): Promise<DocumentsPage> {
  const page = await listPublishedDocumentsPage(request);
  return {
    items: page.items.map(toPublic),
    page: page.page,
    pageSize: page.pageSize,
    total: page.total,
    pageCount: page.pageCount,
  };
}

export async function listLatestDocuments(limit = 4): Promise<PublicDocument[]> {
  const rows = await listPublishedDocuments(limit);
  return rows.map(toPublic);
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
