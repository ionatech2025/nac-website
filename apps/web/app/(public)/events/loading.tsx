import { LoadingState } from "@/components/content-states";
import styles from "./events.module.css";

export default function EventsLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading events"
        message="Fetching the events calendar…"
      />
    </div>
  );
}
