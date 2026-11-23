import Image from "next/image";
import Link from "next/link";
import {
  formatArticleDate,
  type ArticleListItem,
} from "@/lib/news-data";
import styles from "./article-card.module.css";

type Props = {
  article: ArticleListItem;
};

export function ArticleCard({ article }: Props) {
  const dateLabel = formatArticleDate(article.publishedAt);

  return (
    <li className={styles.item}>
      {article.coverImage ? (
        <div className={styles.media}>
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.altText}
            width={640}
            height={400}
            className={styles.image}
            sizes="(max-width: 800px) 100vw, 280px"
          />
        </div>
      ) : null}
      <div className={styles.copy}>
        {dateLabel ? <p className={styles.date}>{dateLabel}</p> : null}
        <h2 className={styles.title}>
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h2>
        {article.excerpt ? (
          <p className={styles.excerpt}>{article.excerpt}</p>
        ) : null}
        <Link className={styles.more} href={`/news/${article.slug}`}>
          Read more
        </Link>
      </div>
    </li>
  );
}
