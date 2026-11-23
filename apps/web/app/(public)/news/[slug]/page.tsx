import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailView } from "@/components/news/article-detail";
import { getArticleBySlug } from "@/lib/news-data";
import { absoluteUrl } from "@/lib/share-links";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };

  const title = article.seoTitle?.trim() || article.title;
  const description =
    article.seoDescription?.trim() || article.excerpt || undefined;
  const shareImage = article.ogImage ?? article.coverImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/news/${article.slug}`),
      images: shareImage
        ? [{ url: shareImage.url, alt: shareImage.altText }]
        : undefined,
    },
    twitter: {
      card: shareImage ? "summary_large_image" : "summary",
      title,
      description,
      images: shareImage ? [shareImage.url] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return <ArticleDetailView article={article} />;
}
