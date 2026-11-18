import Link from "next/link";
import styles from "./content-states.module.css";

type BaseProps = {
  title?: string;
  message?: string;
};

export function LoadingState({
  title = "Loading",
  message = "Fetching the latest content…",
}: BaseProps) {
  return (
    <div className={styles.panel} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Check back soon — new content will appear here when it is published.",
}: BaseProps) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
}

type ErrorProps = BaseProps & {
  homeHref?: string;
  retryHref?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We could not load this content. Please try again.",
  homeHref = "/",
  retryHref,
}: ErrorProps) {
  return (
    <div className={styles.panel} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        {retryHref ? (
          <Link className={styles.primary} href={retryHref}>
            Try again
          </Link>
        ) : null}
        <Link className={styles.secondary} href={homeHref}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
