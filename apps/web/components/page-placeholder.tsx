import { EmptyState } from "./content-states";
import styles from "./page-placeholder.module.css";

type Props = {
  title: string;
  description: string;
};

/** Minimal route shell so E1 navigation targets resolve. No epic content. */
export function PagePlaceholder({ title, description }: Props) {
  return (
    <section className={styles.section} aria-labelledby="page-title">
      <p className={styles.kicker}>Network for Active Citizens</p>
      <h1 id="page-title" className={styles.title}>
        {title}
      </h1>
      <p className={styles.lead}>{description}</p>
      <EmptyState
        title="Section not built yet"
        message="This route exists so Epic 1 navigation works. Section content comes in later epics."
      />
    </section>
  );
}
