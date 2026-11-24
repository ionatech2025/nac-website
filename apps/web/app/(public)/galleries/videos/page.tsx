import type { Metadata } from "next";
import Link from "next/link";
import { VideoGallery } from "@/components/galleries/video-gallery";
import { listVideos } from "@/lib/galleries-data";
import styles from "../galleries.module.css";

export const metadata: Metadata = {
  title: "Video Gallery",
  description:
    "Watch NAC videos embedded from allowlisted YouTube and Vimeo links.",
};

export default async function VideoGalleryPage() {
  const videos = await listVideos();

  return (
    <section className={styles.page} aria-labelledby="videos-heading">
      <p className={styles.eyebrow}>Galleries</p>
      <h1 id="videos-heading" className={styles.title}>
        Video Gallery
      </h1>
      <p className={styles.lead}>
        Embedded playback from YouTube and Vimeo only. Unsupported providers are
        shown with a clear message instead of unsafe embed HTML.
      </p>
      <p className={styles.back}>
        <Link href="/galleries">← All galleries</Link>
      </p>
      <VideoGallery videos={videos} />
    </section>
  );
}
