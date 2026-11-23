import type { Metadata } from "next";
import { AboutImages } from "@/components/about/about-images";
import { AboutKeyFigures } from "@/components/about/about-key-figures";
import { AboutProgrammes } from "@/components/about/about-programmes";
import { AboutSections } from "@/components/about/about-sections";
import { EmptyState } from "@/components/content-states";
import {
  getAboutKeyFigures,
  getAboutPageContent,
  getAboutProgrammes,
} from "@/lib/about-data";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn who Network for Active Citizens is — founded in 2017 to build youth resilience across Uganda.",
};

export default async function AboutPage() {
  const [about, figures, programmes] = await Promise.all([
    getAboutPageContent(),
    getAboutKeyFigures(),
    getAboutProgrammes(),
  ]);

  const hasCopy =
    about.mission.trim() ||
    about.vision.trim() ||
    about.whatWeDo.trim() ||
    about.why.trim();

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Network for Active Citizens</p>
        <h1 className={styles.title}>{about.title}</h1>
      </header>

      <AboutImages images={about.images} />

      {hasCopy ? (
        <AboutSections
          mission={about.mission}
          vision={about.vision}
          whatWeDo={about.whatWeDo}
          why={about.why}
        />
      ) : (
        <EmptyState
          title="About copy coming soon"
          message="Mission, vision and story will appear here once content is ready."
        />
      )}

      <AboutKeyFigures figures={figures} />
      <AboutProgrammes programmes={programmes} />
    </article>
  );
}
