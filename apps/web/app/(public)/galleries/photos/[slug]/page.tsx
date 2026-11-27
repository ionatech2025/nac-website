import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoLightbox } from "@/components/galleries/photo-lightbox";
import { getAlbumBySlug } from "@/lib/galleries-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import styles from "../../galleries.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return { title: "Album" };
  return publicPageMetadata({
    title: album.title,
    description: `Photos from ${album.title} (${album.imageCount}).`,
    path: `/galleries/photos/${album.slug}`,
  });
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  return (
    <section className={styles.page} aria-labelledby="album-heading">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>
            <Link href="/galleries/photos">Photos</Link>
          </p>
          <h1 id="album-heading" className={styles.title}>
            {album.title}
          </h1>
          <p className={styles.lead}>
            {album.imageCount} photo{album.imageCount === 1 ? "" : "s"}. Open
            any image for a larger view with captions.
          </p>
        </div>
      </header>
      <div className={styles.body}>
        <PhotoLightbox images={album.images} albumTitle={album.title} />
      </div>
    </section>
  );
}
