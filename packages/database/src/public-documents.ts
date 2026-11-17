import { prisma } from "./client";
import { boundedTake, pageWindow, toPage, type PageRequest } from "./pagination";
import { documentDownloadPath } from "./media-urls";

const documentInclude = {
  category: true,
  media: { select: { url: true, fileName: true, byteSize: true } },
} as const;

/**
 * Public reads — only PUBLISHED documents (AD-B3-02). Link to `downloadPath`,
 * not `media.url`: it stays valid when the PDF is replaced (AD-B7-03).
 */
export async function listPublishedDocuments(limit = 100) {
  const rows = await prisma.document.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
    take: boundedTake(limit),
    include: documentInclude,
  });
  return rows.map((row) => ({ ...row, downloadPath: documentDownloadPath(row.id) }));
}

/** Paged Downloads page, optionally filtered by category slug (`?category=&page=`). */
export async function listPublishedDocumentsPage(
  request: PageRequest & { categorySlug?: string } = {},
) {
  const window = pageWindow(request);
  const where = {
    status: "PUBLISHED" as const,
    ...(request.categorySlug ? { category: { slug: request.categorySlug } } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
      skip: window.skip,
      take: window.take,
      include: documentInclude,
    }),
    prisma.document.count({ where }),
  ]);
  const items = rows.map((row) => ({ ...row, downloadPath: documentDownloadPath(row.id) }));
  return toPage(items, total, window);
}

/** Categories that have at least one published document (for filter chips). */
export async function listDocumentCategoriesInUse() {
  return prisma.documentCategory.findMany({
    where: { documents: { some: { status: "PUBLISHED" } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });
}

export async function getPublishedDocumentById(id: string) {
  const row = await prisma.document.findFirst({
    where: { id, status: "PUBLISHED" },
    include: documentInclude,
  });
  return row ? { ...row, downloadPath: documentDownloadPath(row.id) } : null;
}
