import styles from "../cms.module.css";

export function EventStatusBadge({ status }: { status: string }) {
  const label =
    status === "DRAFT"
      ? "Draft"
      : status === "PUBLISHED"
        ? "Published"
        : status === "CANCELLED"
          ? "Cancelled"
          : status === "ARCHIVED"
            ? "Archived"
            : status;

  const className =
    status === "PUBLISHED"
      ? `${styles.badge} ${styles.badgePublished}`
      : status === "CANCELLED" || status === "ARCHIVED"
        ? `${styles.badge} ${styles.badgeArchived}`
        : styles.badge;

  return <span className={className}>{label}</span>;
}
