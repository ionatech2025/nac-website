import { LoadingState } from "@/components/content-states";
import styles from "./staff.module.css";

export default function StaffLoading() {
  return (
    <div className={styles.page}>
      <LoadingState title="Loading staff" message="Fetching the team directory…" />
    </div>
  );
}
