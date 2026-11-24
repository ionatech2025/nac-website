import type { Metadata } from "next";
import { RegionList } from "@/components/youth-spaces/region-list";
import {
  listYouthRegions,
  YOUTH_SPACES_INTRO,
} from "@/lib/youth-spaces-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import styles from "./youth-spaces.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Youth Spaces",
  description: YOUTH_SPACES_INTRO,
  path: "/youth-spaces",
});

export default async function YouthSpacesPage() {
  const regions = await listYouthRegions();

  return (
    <section className={styles.page} aria-labelledby="youth-spaces-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="youth-spaces-heading" className={styles.title}>
        Youth Spaces
      </h1>
      <p className={styles.lead}>{YOUTH_SPACES_INTRO}</p>
      <RegionList regions={regions} />
    </section>
  );
}
