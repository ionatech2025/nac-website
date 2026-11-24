import { LoadingState } from "@/components/content-states";
import styles from "./complaints.module.css";

export default function ComplaintsLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading complaints page"
        message="Preparing the anonymous complaint form…"
      />
    </div>
  );
}
