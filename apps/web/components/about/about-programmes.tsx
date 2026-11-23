import Link from "next/link";
import styles from "./about-programmes.module.css";

export type AboutProgramme = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
};

type Props = {
  programmes: AboutProgramme[];
};

export function AboutProgrammes({ programmes }: Props) {
  if (programmes.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="about-programmes-heading">
      <h2 id="about-programmes-heading" className={styles.heading}>
        Our programmes
      </h2>
      <p className={styles.lead}>
        Explore the programme areas that shape NAC’s work with young people.
      </p>
      <ul className={styles.list}>
        {programmes.map((programme) => (
          <li key={programme.id} className={styles.item}>
            <h3 className={styles.title}>
              <Link href={`/programs/${programme.slug}`}>{programme.title}</Link>
            </h3>
            {programme.summary ? (
              <p className={styles.summary}>{programme.summary}</p>
            ) : null}
            <Link className={styles.more} href={`/programs/${programme.slug}`}>
              View programme
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
