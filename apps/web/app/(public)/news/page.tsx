import type { Metadata } from "next";
import { MediaTabs } from "@/components/galleries/media-tabs";
import { ArticleList } from "@/components/news/article-list";
import { listArticlesPage } from "@/lib/news-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import styles from "./news.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Blogs & News",
  description:
    "News and stories from the Network for Active Citizens across Uganda.",
  path: "/news",
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const result = await listArticlesPage({ page: Number(pageParam) || 1 });

  return (
    <section className={styles.page} aria-labelledby="news-heading">
      <p className={styles.eyebrow}>Media Center</p>
      <h1 id="news-heading" className={styles.title}>
        Blogs & News
      </h1>
      <p className={styles.lead}>
        Stories and updates from youth organisers and partners across the NAC
        network.
      </p>
      <MediaTabs active="news" />
      <ArticleList
        articles={result.items}
        page={result.page}
        pageCount={result.pageCount}
      />
    </section>
  );
}
