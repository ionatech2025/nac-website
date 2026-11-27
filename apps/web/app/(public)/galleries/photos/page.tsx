import type { Metadata } from "next";
import { AlbumList } from "@/components/galleries/album-list";
import { MediaTabs } from "@/components/galleries/media-tabs";
import { listAlbumsPage } from "@/lib/galleries-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import styles from "../galleries.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Photo Gallery",
  description: "Browse published NAC photo albums from programmes and events.",
  path: "/galleries/photos",
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PhotoGalleryPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const result = await listAlbumsPage({ page: Number(page) || 1 });

  return (
    <section className={styles.page} aria-labelledby="photos-heading">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Media Center</p>
          <h1 id="photos-heading" className={styles.title}>
            Photos
          </h1>
          <p className={styles.lead}>
            Albums of network activity. Open an album to browse photos in a
            lightbox.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <MediaTabs active="photos" />
        <AlbumList
          albums={result.items}
          page={result.page}
          pageCount={result.pageCount}
        />
      </div>
    </section>
  );
}
