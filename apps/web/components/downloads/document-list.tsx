import Link from "next/link";
import { EmptyState } from "@/components/content-states";
import type { PublicDocument } from "@/lib/downloads-data";
import { DocumentCard } from "./document-card";
import styles from "./document-list.module.css";

type Props = {
  documents: PublicDocument[];
  page: number;
  pageCount: number;
  categorySlug: string;
};

function hrefFor(page: number, categorySlug: string): string {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/downloads?${query}` : "/downloads";
}

export function DocumentList({
  documents,
  page,
  pageCount,
  categorySlug,
}: Props) {
  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents in this category"
        message="Try another category, or browse all downloads."
      />
    );
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </ul>
      {pageCount > 1 ? (
        <nav className={styles.pager} aria-label="Downloads pages">
          {page > 1 ? (
            <Link href={hrefFor(page - 1, categorySlug)} rel="prev">
              Previous
            </Link>
          ) : (
            <span className={styles.disabled}>Previous</span>
          )}
          <p>
            Page {page} of {pageCount}
          </p>
          {page < pageCount ? (
            <Link href={hrefFor(page + 1, categorySlug)} rel="next">
              Next
            </Link>
          ) : (
            <span className={styles.disabled}>Next</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
