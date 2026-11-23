import { LoadingState } from "@/components/content-states";
import styles from "./opportunities.module.css";

export default function OpportunitiesLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading opportunities"
        message="Fetching open calls and listings…"
      />
    </div>
  );
}
