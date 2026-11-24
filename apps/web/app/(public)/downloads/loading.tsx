import { LoadingState } from "@/components/content-states";
import styles from "./downloads.module.css";

export default function DownloadsLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading downloads"
        message="Fetching the document library…"
      />
    </div>
  );
}
