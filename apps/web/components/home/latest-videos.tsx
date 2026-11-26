import type { HomeVideo } from "@/lib/home-data";
import { getSafeEmbedSrc } from "@/lib/video-embed";
import { SectionShell } from "./section-shell";
import styles from "./latest-videos.module.css";

type Props = {
  videos: HomeVideo[];
};

export function LatestVideos({ videos }: Props) {
  if (videos.length === 0) return null;

  return (
    <SectionShell
      id="latest-videos"
      eyebrow="Watch"
      title="Stories on screen"
      lead="Recent video from NAC spaces and partners."
      tone="band"
    >
      <ul className={styles.list}>
        {videos.map((video) => {
          const src = getSafeEmbedSrc(video.provider, video.url);
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
                  This video could not be embedded safely.
                </p>
              )}
              <h3 className={styles.title}>{video.title}</h3>
              {video.description ? (
                <p className={styles.description}>{video.description}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
