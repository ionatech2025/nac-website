import Link from "next/link";
import styles from "./news-pagination.module.css";

type Props = {
  page: number;
  pageCount: number;
};

function hrefFor(page: number): string {
  return page <= 1 ? "/news" : `/news?page=${page}`;
}

export function NewsPagination({ page, pageCount }: Props) {
  if (pageCount <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < pageCount ? page + 1 : null;

  return (
    <nav className={styles.nav} aria-label="News pages">
      {prev ? (
        <Link className={styles.link} href={hrefFor(prev)} rel="prev">
          Previous
        </Link>
      ) : (
        <span className={styles.disabled}>Previous</span>
      )}
      <p className={styles.status}>
        Page {page} of {pageCount}
      </p>
      {next ? (
        <Link className={styles.link} href={hrefFor(next)} rel="next">
          Next
        </Link>
      ) : (
        <span className={styles.disabled}>Next</span>
      )}
    </nav>
  );
}
