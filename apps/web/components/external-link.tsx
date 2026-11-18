import type { ReactNode } from "react";
import styles from "./external-link.module.css";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: Props) {
  const classes = [styles.link, className].filter(Boolean).join(" ");

  return (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className={styles.mark} aria-hidden="true">
        ↗
      </span>
      <span className={styles.srOnly}>(opens in a new tab)</span>
    </a>
  );
}
