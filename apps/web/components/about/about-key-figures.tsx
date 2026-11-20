import styles from "./about-key-figures.module.css";

export type AboutFigure = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  figures: AboutFigure[];
};

export function AboutKeyFigures({ figures }: Props) {
  if (figures.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="about-figures-heading">
      <h2 id="about-figures-heading" className={styles.heading}>
        NAC in numbers
      </h2>
      <ul className={styles.list}>
        {figures.map((figure) => (
          <li key={figure.id} className={styles.item}>
            <p className={styles.value}>{figure.value}</p>
            <p className={styles.label}>{figure.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
