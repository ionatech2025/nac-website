import type { KeyFigureItem } from "@/lib/home-data";
import styles from "./key-figures.module.css";

type Props = {
  figures: KeyFigureItem[];
};

export function KeyFiguresStrip({ figures }: Props) {
  if (figures.length === 0) return null;

  return (
    <section className={styles.section} aria-label="NAC in numbers">
      <div className={styles.inner}>
        <ul className={styles.list}>
          {figures.map((figure) => (
            <li key={figure.id} className={styles.item}>
              <p className={styles.value}>{figure.value}</p>
              <p className={styles.label}>{figure.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
