import styles from "./skip-link.module.css";

/** Keyboard-first jump to main content (WCAG 2.2 AA / E15-05). */
export function SkipLink() {
  return (
    <a href="#main" className={styles.skip}>
      Skip to main content
    </a>
  );
}
