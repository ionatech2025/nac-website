import Image from "next/image";
import Link from "next/link";
import type { AlbumListItem } from "@/lib/galleries-data";
import styles from "./album-card.module.css";

type Props = {
  album: AlbumListItem;
};

export function AlbumCard({ album }: Props) {
  return (
    <li className={styles.item}>
      <Link href={`/galleries/photos/${album.slug}`} className={styles.link}>
        {album.coverUrl ? (
          <div className={styles.media}>
            <Image
              src={album.coverUrl}
              alt={album.coverAlt}
              width={640}
              height={420}
              className={styles.image}
              sizes="(max-width: 800px) 100vw, 320px"
            />
          </div>
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
        <div className={styles.copy}>
          <h2 className={styles.title}>{album.title}</h2>
          <p className={styles.meta}>
            {album.imageCount} photo{album.imageCount === 1 ? "" : "s"}
          </p>
        </div>
      </Link>
    </li>
  );
}
