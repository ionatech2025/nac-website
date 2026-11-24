import Link from "next/link";
import { EmptyState } from "@/components/content-states";
import type { AlbumListItem } from "@/lib/galleries-data";
import { AlbumCard } from "./album-card";
import styles from "./album-list.module.css";

type Props = {
  albums: AlbumListItem[];
  page: number;
  pageCount: number;
};

function hrefFor(page: number): string {
  return page <= 1 ? "/galleries/photos" : `/galleries/photos?page=${page}`;
}

export function AlbumList({ albums, page, pageCount }: Props) {
  if (albums.length === 0) {
    return (
      <EmptyState
        title="No photo albums yet"
        message="Published albums will appear here when they are available."
      />
    );
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </ul>
      {pageCount > 1 ? (
        <nav className={styles.pager} aria-label="Album pages">
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} rel="prev">
              Previous
            </Link>
          ) : (
            <span className={styles.disabled}>Previous</span>
          )}
          <p>
            Page {page} of {pageCount}
          </p>
          {page < pageCount ? (
            <Link href={hrefFor(page + 1)} rel="next">
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
