import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import type { MemberOrganisationDetail } from "@/lib/member-organisations-data";
import { memberExternalLinkLabel } from "@/lib/member-link-label";
import { RichText } from "@/lib/rich-text-view";
import styles from "./member-org-detail.module.css";

type Props = {
  organisation: MemberOrganisationDetail;
};

export function MemberOrgDetailView({ organisation }: Props) {
  const website = organisation.websiteUrl?.trim() || null;
  const images = organisation.images.slice(0, 3);

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/member-organisations">Member organisations</Link>
      </p>
      <h1 className={styles.title}>{organisation.name}</h1>

      <RichText text={organisation.bio} className={styles.body} />

      {website ? (
        <p className={styles.website}>
          <ExternalLink href={website}>
            {memberExternalLinkLabel(website)}
          </ExternalLink>
        </p>
      ) : null}

      {images.length > 0 ? (
        <section className={styles.gallery} aria-label="Organisation photos">
          <ul className={styles.images}>
            {images.map((image) => (
              <li key={image.id} className={styles.imageItem}>
                <Image
                  src={image.url}
                  alt={image.altText}
                  width={960}
                  height={640}
                  className={styles.image}
                  sizes="(max-width: 900px) 100vw, 640px"
                  unoptimized
                />
                {image.caption ? (
                  <p className={styles.caption}>{image.caption}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
