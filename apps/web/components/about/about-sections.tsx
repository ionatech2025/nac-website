import { RichText } from "@/lib/rich-text-view";
import styles from "./about-sections.module.css";

type Props = {
  mission: string;
  vision: string;
  whatWeDo: string;
  why: string;
};

type Block = {
  id: string;
  mark: string;
  title: string;
  text: string;
};

export function AboutSections({ mission, vision, whatWeDo, why }: Props) {
  const blocks: Block[] = [
    { id: "vision", mark: "V", title: "Our vision", text: vision },
    { id: "mission", mark: "M", title: "Our mission", text: mission },
    { id: "what", mark: "A", title: "What we do", text: whatWeDo },
    { id: "why", mark: "W", title: "Why", text: why },
  ].filter((block) => block.text.trim());

  if (blocks.length === 0) return null;

  return (
    <div className={styles.grid}>
      {blocks.map((block) => (
        <section
          key={block.id}
          className={styles.card}
          aria-labelledby={`about-${block.id}-heading`}
        >
          <span className={styles.mark} aria-hidden="true">
            {block.mark}
          </span>
          <div className={styles.body}>
            <h2 id={`about-${block.id}-heading`} className={styles.heading}>
              {block.title}
            </h2>
            <RichText text={block.text} className={styles.rich} />
          </div>
        </section>
      ))}
    </div>
  );
}
