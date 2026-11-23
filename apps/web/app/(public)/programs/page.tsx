import type { Metadata } from "next";
import { ProgrammeList } from "@/components/programmes/programme-list";
import { listProgrammes } from "@/lib/programmes-data";
import styles from "./programs.module.css";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore NAC’s programme areas — governance, climate resilience, community journalism, and youth organizing.",
};

export default async function ProgramsPage() {
  const programmes = await listProgrammes();

  return (
    <section className={styles.page} aria-labelledby="programs-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="programs-heading" className={styles.title}>
        Programs
      </h1>
      <p className={styles.lead}>
        Programme areas NAC runs with young people and partner organisations
        across Uganda.
      </p>
      <ProgrammeList programmes={programmes} />
    </section>
  );
}
