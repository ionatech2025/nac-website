import Image from "next/image";
import Link from "next/link";
import { ShareLinks } from "@/components/share-links";
import {
  formatArticleDate,
  type ArticleDetail as ArticleDetailType,
} from "@/lib/news-data";
import { RichText } from "@/lib/rich-text-view";
import styles from "./article-detail.module.css";

type Props = {
  article: ArticleDetailType;
};

export function ArticleDetailView({ article }: Props) {
  const dateLabel = formatArticleDate(article.publishedAt);
  const cover = article.coverImage;

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/news">Blogs & News</Link>
      </p>
      <h1 className={styles.title}>{article.title}</h1>
      <div className={styles.meta}>
        {dateLabel ? <time dateTime={article.publishedAt ?? undefined}>{dateLabel}</time> : null}
        {article.author ? (
          <span className={styles.author}>By {article.author}</span>
        ) : null}
      </div>

      {cover ? (
        <div className={styles.hero}>
          <Image
            src={cover.url}
            alt={cover.altText}
            width={960}
            height={540}
            className={styles.heroImage}
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
      ) : null}

      <RichText text={article.body} className={styles.body} />

      <ShareLinks path={`/news/${article.slug}`} title={article.title} />
    </article>
  );
}
