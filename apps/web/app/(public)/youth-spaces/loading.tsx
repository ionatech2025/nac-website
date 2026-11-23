import { LoadingState } from "@/components/content-states";
import styles from "./youth-spaces.module.css";

export default function YouthSpacesLoading() {
  return (
    <div className={styles.page}>
      <LoadingState
        title="Loading youth spaces"
        message="Fetching spaces by region…"
      />
    </div>
  );
}
