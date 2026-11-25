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
      {cover ? (
        <div className={styles.media}>
          <Image
            src={cover.url}
            alt={cover.altText}
            width={640}
            height={400}
            className={styles.image}
            sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
            unoptimized
          />
        </div>
      ) : null}
      <div className={styles.copy}>
        <h2 className={styles.title}>
          <Link href={href}>{organisation.name}</Link>
        </h2>
        <p className={styles.excerpt}>{organisation.excerpt}</p>
        <Link className={styles.more} href={href}>
          View organisation
        </Link>
      </div>
    </li>
  );
}
