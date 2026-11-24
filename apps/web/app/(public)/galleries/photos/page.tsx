import type { Metadata } from "next";
import Link from "next/link";
import { AlbumList } from "@/components/galleries/album-list";
import { listAlbumsPage } from "@/lib/galleries-data";
import styles from "../galleries.module.css";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Browse published NAC photo albums.",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PhotoGalleryPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const result = await listAlbumsPage({ page: Number(page) || 1 });

  return (
    <section className={styles.page} aria-labelledby="photos-heading">
      <p className={styles.eyebrow}>Galleries</p>
      <h1 id="photos-heading" className={styles.title}>
        Photo Gallery
      </h1>
      <p className={styles.lead}>
        Albums of network activity. Open an album to browse photos in a
        lightbox.
      </p>
      <p className={styles.back}>
        <Link href="/galleries">← All galleries</Link>
      </p>
      <AlbumList
        albums={result.items}
        page={result.page}
        pageCount={result.pageCount}
      />
    </section>
  );
}
