import type { KeyFigureItem } from "@/lib/home-data";
import { SectionShell } from "./section-shell";
import styles from "./key-figures.module.css";

type Props = {
  figures: KeyFigureItem[];
};

export function KeyFiguresStrip({ figures }: Props) {
  if (figures.length === 0) return null;

  return (
    <SectionShell
      id="key-figures"
      eyebrow="At a glance"
      title="NAC in numbers"
      lead="Editable figures that show the reach of the network."
    >
      <ul className={styles.list}>
        {figures.map((figure) => (
          <li key={figure.id} className={styles.item}>
            <p className={styles.value}>{figure.value}</p>
            <p className={styles.label}>{figure.label}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
