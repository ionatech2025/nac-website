import { RichText } from "@/lib/rich-text-view";
import styles from "./about-sections.module.css";

type Props = {
  mission: string;
  vision: string;
  whatWeDo: string;
  why: string;
};

export function AboutSections({ mission, vision, whatWeDo, why }: Props) {
  return (
    <div className={styles.stack}>
      <section aria-labelledby="about-mission-heading">
        <h2 id="about-mission-heading" className={styles.heading}>
          Our mission
        </h2>
        <RichText text={mission} className={styles.rich} />
      </section>

      <section aria-labelledby="about-vision-heading">
        <h2 id="about-vision-heading" className={styles.heading}>
          Our vision
        </h2>
        <RichText text={vision} className={styles.rich} />
      </section>

      <section aria-labelledby="about-what-heading">
        <h2 id="about-what-heading" className={styles.heading}>
          What we do
        </h2>
        <RichText text={whatWeDo} className={styles.rich} />
      </section>

      {why.trim() ? (
        <section aria-labelledby="about-why-heading">
          <h2 id="about-why-heading" className={styles.heading}>
            Why
          </h2>
          <RichText text={why} className={styles.rich} />
        </section>
      ) : null}
    </div>
  );
}
