import type { Metadata } from "next";
import { MediaTabs } from "@/components/galleries/media-tabs";
import { VideoGallery } from "@/components/galleries/video-gallery";
import { listVideos } from "@/lib/galleries-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import styles from "../galleries.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Video Gallery",
  description:
    "Watch NAC videos embedded from allowlisted YouTube and Vimeo links.",
  path: "/galleries/videos",
});

export default async function VideoGalleryPage() {
  const videos = await listVideos();

  return (
    <section className={styles.page} aria-labelledby="videos-heading">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Media Center</p>
          <h1 id="videos-heading" className={styles.title}>
            Videos
          </h1>
          <p className={styles.lead}>
            Embedded playback from YouTube and Vimeo. Unsupported providers show
            a clear message instead of unsafe embed HTML.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <MediaTabs active="videos" />
        <VideoGallery videos={videos} />
      </div>
    </section>
  );
}
