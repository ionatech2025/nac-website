/**
 * News/articles seed/fallback for Epic E7 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers later.
 */

import { SEED_ARTICLES, type SeedArticle } from "./news-seed";

export type ArticleImage = {
  url: string;
  altText: string;
};

export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImage: ArticleImage | null;
};

export type ArticleDetail = ArticleListItem & {
  body: string;
  author: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: ArticleImage | null;
};

export type ArticlesPage = {
  items: ArticleListItem[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

function toImage(
  url: string | null,
  alt: string | null,
  fallbackAlt: string,
): ArticleImage | null {
  if (!url) return null;
  return { url, altText: alt?.trim() || fallbackAlt };
}

function toListItem(article: SeedArticle): ArticleListItem {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    coverImage: toImage(article.coverImageUrl, article.coverImageAlt, article.title),
  };
}

function toDetail(article: SeedArticle): ArticleDetail {
  return {
    ...toListItem(article),
    body: article.body,
    author: article.author,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    ogImage: toImage(article.ogImageUrl, article.coverImageAlt, article.title),
  };
}

const sorted = [...SEED_ARTICLES].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

function normalisePage(page?: number, pageSize = 12) {
  const size = Math.min(Math.max(Math.floor(pageSize) || 12, 1), 100);
  const current = Math.max(1, Math.floor(Number(page)) || 1);
  return { page: current, pageSize: size };
}

/** Paged listing (FE-E7-01), newest first. */
export async function listArticlesPage(request: {
  page?: number;
  pageSize?: number;
} = {}): Promise<ArticlesPage> {
  const window = normalisePage(request.page, request.pageSize);
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / window.pageSize));
  const page = Math.min(window.page, pageCount);
  const start = (page - 1) * window.pageSize;
  const items = sorted.slice(start, start + window.pageSize).map(toListItem);
  return { items, page, pageSize: window.pageSize, total, pageCount };
}

/** Detail (FE-E7-02): null unless “published” in seed. */
export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  const article = sorted.find((row) => row.slug === slug);
  return article ? toDetail(article) : null;
}

/** Format published date for public UI (Africa/Kampala calendar day). */
export function formatArticleDate(iso: string | null): string | null {
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
