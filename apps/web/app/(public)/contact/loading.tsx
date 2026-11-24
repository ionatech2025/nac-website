import { LoadingState } from "@/components/content-states";
import styles from "./contact.module.css";

export default function ContactLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading contact"
        message="Fetching contact details…"
      />
    </div>
  );
}
