import type { ReactNode } from "react";
import styles from "./page-frame.module.css";

type Props = {
  eyebrow?: string;
  title: string;
  titleId?: string;
  lead?: string;
  children: ReactNode;
  as?: "section" | "div";
};

export function PageFrame({
  eyebrow,
  title,
  titleId = "page-heading",
  lead,
  children,
  as: Tag = "section",
}: Props) {
  return (
    <Tag className={styles.page} aria-labelledby={titleId}>
      <header className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </header>
      {children}
    </Tag>
  );
}
