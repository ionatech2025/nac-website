import { EmptyState } from "@/components/content-states";
import { formatBytes } from "@/lib/format-bytes";
import styles from "./latest-downloads.module.css";

export type LatestDownloadItem = {
  id: string;
  title: string;
  href: string;
  byteSize?: number;
  fileType?: string;
};

type Props = {
  downloads: LatestDownloadItem[];
  heading?: string;
};

export function LatestDownloads({
  downloads,
  heading = "Latest downloads",
}: Props) {
  if (downloads.length === 0) {
    return (
      <EmptyState
        title="No downloads yet"
        message="Published documents will show here when available."
      />
    );
  }

  return (
    <div>
      <h3 className={styles.heading}>{heading}</h3>
      <ul className={styles.list}>
        {downloads.map((file) => {
          const size = formatBytes(file.byteSize);
          const meta = [file.fileType, size].filter(Boolean).join(" · ");
          return (
            <li key={file.id} className={styles.item}>
              <a
                href={file.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.title}
                <span className={styles.srOnly}> (opens in a new tab)</span>
              </a>
              {meta ? <span className={styles.size}>{meta}</span> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
