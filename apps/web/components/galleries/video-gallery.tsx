import { EmptyState } from "@/components/content-states";
import type { GalleryVideo } from "@/lib/galleries-data";
import { getSafeEmbedSrc, type EmbedProvider } from "@/lib/video-embed";
import { RichText } from "@/lib/rich-text-view";
import styles from "./video-gallery.module.css";

type Props = {
  videos: GalleryVideo[];
};

export function VideoGallery({ videos }: Props) {
  if (videos.length === 0) {
    return (
      <EmptyState
        title="No videos published yet"
        message="Published video links will embed here when available."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {videos.map((video) => {
        const provider =
          video.provider === "YOUTUBE" || video.provider === "VIMEO"
            ? (video.provider as EmbedProvider)
            : null;
        const src = provider ? getSafeEmbedSrc(provider, video.url) : null;

        return (
          <li key={video.id} className={styles.item}>
            {src ? (
              <div className={styles.embed}>
                <iframe
                  src={src}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <p className={styles.blocked}>
                This video could not be embedded. Only YouTube and Vimeo links
                are supported.
              </p>
            )}
            <h2 className={styles.title}>{video.title}</h2>
            <RichText text={video.description} className={styles.description} />
          </li>
        );
      })}
    </ul>
  );
}
