import { labelContentStatus } from "../../../lib/content-status";
import styles from "../cms.module.css";

export function StatusBadge({ status }: { status: string }) {
  const className =
    status === "PUBLISHED"
      ? `${styles.badge} ${styles.badgePublished}`
      : status === "ARCHIVED"
        ? `${styles.badge} ${styles.badgeArchived}`
        : styles.badge;

  return <span className={className}>{labelContentStatus(status)}</span>;
}
