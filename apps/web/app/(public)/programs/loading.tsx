import { LoadingState } from "@/components/content-states";
import styles from "./programs.module.css";

export default function ProgramsLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading programmes"
        message="Fetching NAC’s programme areas…"
      />
    </div>
  );
}
