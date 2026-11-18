import { prisma } from "./client";
import { boundedTake, pageWindow, toPage, type PageRequest } from "./pagination";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";

/** Public reads — only PUBLISHED articles (AD-B3-01). */
export async function listPublishedArticles(limit = 50) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: boundedTake(limit),
    include: {
      coverImage: { select: PUBLIC_IMAGE_SELECT },
    },
  });
}

/** Paged news list (`?page=`), newest first. */
export async function listPublishedArticlesPage(request: PageRequest = {}) {
  const window = pageWindow(request);
  const where = { status: "PUBLISHED" as const };
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: window.skip,
      take: window.take,
      include: { coverImage: { select: PUBLIC_IMAGE_SELECT } },
    }),
    prisma.article.count({ where }),
  ]);
  return toPage(items, total, window);
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      coverImage: { select: PUBLIC_IMAGE_SELECT },
      ogImage: { select: PUBLIC_IMAGE_SELECT },
    },
  });
}
