import { LoadingState } from "@/components/content-states";
import styles from "./galleries.module.css";

export default function GalleriesLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading galleries"
        message="Fetching albums and videos…"
      />
    </div>
  );
}
