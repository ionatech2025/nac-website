import type { ReactNode } from "react";
import styles from "./section-shell.module.css";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  tone?: "plain" | "tint" | "band";
  children: ReactNode;
  action?: ReactNode;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  lead,
  tone = "plain",
  children,
  action,
}: Props) {
  const headingId = `${id ?? title}-heading`;
  const toneClass =
    tone === "tint" ? styles.tint : tone === "band" ? styles.band : undefined;

  return (
    <section
      id={id}
      className={[styles.section, toneClass].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            <h2 id={headingId} className={styles.title}>
              {title}
            </h2>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
          </div>
          {action ? <div className={styles.action}>{action}</div> : null}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
