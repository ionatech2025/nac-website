import type { ReactNode } from "react";
import styles from "./external-link.module.css";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Hide the ↗ mark (e.g. icon-only social buttons). */
  showMark?: boolean;
  "aria-label"?: string;
};

export function ExternalLink({
  href,
  children,
  className,
  showMark = true,
  "aria-label": ariaLabel,
}: Props) {
  const classes = [
    showMark ? styles.link : styles.plain,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      {children}
      {showMark ? (
        <span className={styles.mark} aria-hidden="true">
          ↗
        </span>
      ) : null}
      <span className={styles.srOnly}>(opens in a new tab)</span>
    </a>
  );
}
