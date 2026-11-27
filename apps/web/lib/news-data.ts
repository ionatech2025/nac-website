/**
 * News/articles (E07) — published articles from `@repo/database`.
 */

import {
  getPublishedArticleBySlug,
  listPublishedArticlesPage,
  mediaVariantUrl,
} from "@repo/database";

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
  media: {
    url: string;
    altText: string | null;
    thumbUrl?: string | null;
    mediumUrl?: string | null;
  } | null,
  fallbackAlt: string,
): ArticleImage | null {
  if (!media) return null;
  return {
    url: mediaVariantUrl(media, "medium"),
    altText: media.altText?.trim() || fallbackAlt,
  };
}

function toListItem(article: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  coverImage: {
    url: string;
    altText: string | null;
    thumbUrl?: string | null;
    mediumUrl?: string | null;
  } | null;
}): ArticleListItem {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt?.trim() || null,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    coverImage: toImage(article.coverImage, article.title),
  };
}

/** Paged listing (FE-E7-01), newest first. */
export async function listArticlesPage(request: {
  page?: number;
  pageSize?: number;
} = {}): Promise<ArticlesPage> {
  const page = await listPublishedArticlesPage(request);
  return {
    items: page.items.map(toListItem),
    page: page.page,
    pageSize: page.pageSize,
    total: page.total,
    pageCount: page.pageCount,
  };
}

/** Detail (FE-E7-02): null unless published. */
export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return null;
  return {
    ...toListItem(article),
    body: article.body,
    author: article.author?.trim() || null,
    seoTitle: article.seoTitle?.trim() || null,
    seoDescription: article.seoDescription?.trim() || null,
    ogImage: toImage(article.ogImage, article.title),
  };
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
