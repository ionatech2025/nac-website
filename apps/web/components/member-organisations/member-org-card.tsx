import Image from "next/image";
import Link from "next/link";
import type { MemberOrganisationListItem } from "@/lib/member-organisations-data";
import styles from "./member-org-card.module.css";

type Props = {
  organisation: MemberOrganisationListItem;
};

export function MemberOrgCard({ organisation }: Props) {
  const href = `/member-organisations/${organisation.slug}`;
  const cover = organisation.cover;

  return (
    <li className={styles.item}>
      <Link href={href} className={styles.card}>
        <div className={styles.media}>
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.altText}
              width={640}
              height={400}
              className={styles.image}
              sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true" />
          )}
        </div>
        <div className={styles.copy}>
          <h2 className={styles.title}>{organisation.name}</h2>
          <p className={styles.excerpt}>{organisation.excerpt}</p>
          <span className={styles.more}>View organisation</span>
        </div>
      </Link>
    </li>
  );
}
