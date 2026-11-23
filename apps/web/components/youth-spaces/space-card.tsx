import Image from "next/image";
import Link from "next/link";
import type { YouthSpaceListItem } from "@/lib/youth-spaces-data";
import styles from "./space-card.module.css";

type Props = {
  space: YouthSpaceListItem;
};

export function SpaceCard({ space }: Props) {
  const cover = space.images[0] ?? null;

  return (
    <li className={styles.item}>
      {cover ? (
        <div className={styles.media}>
          <Image
            src={cover.url}
            alt={cover.altText}
            width={640}
            height={400}
            className={styles.image}
            sizes="(max-width: 800px) 100vw, 280px"
            unoptimized
          />
        </div>
      ) : null}
      <div className={styles.copy}>
        <h3 className={styles.title}>
          <Link href={`/youth-spaces/${space.slug}`}>{space.name}</Link>
        </h3>
        {space.location ? (
          <p className={styles.meta}>{space.location}</p>
        ) : null}
        <p className={styles.description}>{space.description}</p>
        {space.managingPartner ? (
          <p className={styles.partner}>
            <span className={styles.partnerLabel}>Managing partner</span>
            {space.managingPartner}
          </p>
        ) : null}
        {space.services.length > 0 ? (
          <ul className={styles.services}>
            {space.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        ) : null}
        <Link className={styles.more} href={`/youth-spaces/${space.slug}`}>
          View space
        </Link>
      </div>
    </li>
  );
}
