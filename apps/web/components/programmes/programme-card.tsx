import Image from "next/image";
import Link from "next/link";
import type { ProgrammeListItem } from "@/lib/programmes-data";
import styles from "./programme-card.module.css";

type Props = {
  programme: ProgrammeListItem;
};

export function ProgrammeCard({ programme }: Props) {
  return (
    <li className={styles.item}>
      {programme.cover ? (
        <div className={styles.media}>
          <Image
            src={programme.cover.url}
            alt={programme.cover.altText}
            width={640}
            height={400}
            className={styles.image}
            sizes="(max-width: 800px) 100vw, 320px"
            unoptimized
          />
        </div>
      ) : null}
      <div className={styles.copy}>
        <h2 className={styles.title}>
          <Link href={`/programs/${programme.slug}`}>{programme.title}</Link>
        </h2>
        {programme.summary ? (
          <p className={styles.summary}>{programme.summary}</p>
        ) : null}
        <Link className={styles.more} href={`/programs/${programme.slug}`}>
          View programme
        </Link>
      </div>
    </li>
  );
}
