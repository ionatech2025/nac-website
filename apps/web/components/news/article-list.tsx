import { EmptyState } from "@/components/content-states";
import type { ArticleListItem } from "@/lib/news-data";
import { ArticleCard } from "./article-card";
import { NewsPagination } from "./news-pagination";
import styles from "./article-list.module.css";

type Props = {
  articles: ArticleListItem[];
  page: number;
  pageCount: number;
};

export function ArticleList({ articles, page, pageCount }: Props) {
  if (articles.length === 0) {
    return (
      <EmptyState
        title="No articles published yet"
        message="News and stories will appear here when they are published."
      />
    );
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ul>
      <NewsPagination page={page} pageCount={pageCount} />
    </div>
  );
}
