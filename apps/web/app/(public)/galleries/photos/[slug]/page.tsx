import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoLightbox } from "@/components/galleries/photo-lightbox";
import { getAlbumBySlug } from "@/lib/galleries-data";
import styles from "../../galleries.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  return {
    title: album?.title ?? "Album",
    description: album
      ? `Photos from ${album.title} (${album.imageCount}).`
      : undefined,
  };
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  return (
    <section className={styles.page} aria-labelledby="album-heading">
      <p className={styles.eyebrow}>
        <Link href="/galleries/photos">Photo Gallery</Link>
      </p>
      <h1 id="album-heading" className={styles.title}>
        {album.title}
      </h1>
      <p className={styles.lead}>
        {album.imageCount} photo{album.imageCount === 1 ? "" : "s"}. Open any
        image for a larger view with captions.
      </p>
      <PhotoLightbox images={album.images} albumTitle={album.title} />
    </section>
  );
}
