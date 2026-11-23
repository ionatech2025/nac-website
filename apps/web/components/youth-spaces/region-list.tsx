import { EmptyState } from "@/components/content-states";
import {
  regionSectionId,
  type YouthRegionGroup,
} from "@/lib/youth-spaces-data";
import { SpaceCard } from "./space-card";
import styles from "./region-list.module.css";

type Props = {
  regions: YouthRegionGroup[];
};

export function RegionList({ regions }: Props) {
  if (regions.length === 0) {
    return (
      <EmptyState
        title="No youth spaces published yet"
        message="Spaces will appear here by region when they are published."
      />
    );
  }

  return (
    <div className={styles.wrap}>
      {regions.length > 1 ? (
        <nav className={styles.jumps} aria-label="Jump to region">
          <p className={styles.jumpsLabel}>Regions</p>
          <ul className={styles.jumpsList}>
            {regions.map((region) => (
              <li key={region.id}>
                <a href={`#${regionSectionId(region.name)}`}>{region.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {regions.map((region) => (
        <section
          key={region.id}
          id={regionSectionId(region.name)}
          className={styles.region}
          aria-labelledby={`${regionSectionId(region.name)}-heading`}
        >
          <h2
            id={`${regionSectionId(region.name)}-heading`}
            className={styles.regionTitle}
          >
            {region.name}
          </h2>
          <ul className={styles.spaces}>
            {region.spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
