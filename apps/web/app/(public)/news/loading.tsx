import { LoadingState } from "@/components/content-states";
import styles from "./news.module.css";

export default function NewsLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading news"
        message="Fetching the latest stories…"
      />
    </div>
  );
}
