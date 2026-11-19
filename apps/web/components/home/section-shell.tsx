import type { ReactNode } from "react";
import styles from "./section-shell.module.css";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
};

export function SectionShell({ id, eyebrow, title, lead, children }: Props) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id ?? title}-heading`}>
      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h2 id={`${id ?? title}-heading`} className={styles.title}>
          {title}
        </h2>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
