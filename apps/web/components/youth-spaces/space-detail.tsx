import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { RichText } from "@/lib/rich-text-view";
import type { YouthSpaceDetail as YouthSpaceDetailType } from "@/lib/youth-spaces-data";
import styles from "./space-detail.module.css";

type Props = {
  space: YouthSpaceDetailType;
};

export function SpaceDetailView({ space }: Props) {
  const photos = space.images.slice(0, 5);

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/youth-spaces">Youth Spaces</Link>
        <span aria-hidden="true"> · </span>
        <span>{space.region.name}</span>
      </p>
      <h1 className={styles.title}>{space.name}</h1>
      {space.location ? (
        <p className={styles.location}>{space.location}</p>
      ) : null}

      <RichText text={space.description} className={styles.body} />

      {space.managingPartner ? (
        <section className={styles.block} aria-labelledby="partner-heading">
          <h2 id="partner-heading" className={styles.heading}>
            Managing partner
          </h2>
          <p className={styles.partner}>{space.managingPartner}</p>
        </section>
      ) : null}

      {space.services.length > 0 ? (
        <section className={styles.block} aria-labelledby="services-heading">
          <h2 id="services-heading" className={styles.heading}>
            Services and activities
          </h2>
          <ul className={styles.services}>
            {space.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {photos.length > 0 ? (
        <section className={styles.block} aria-labelledby="photos-heading">
          <h2 id="photos-heading" className={styles.heading}>
            Photos
          </h2>
          <ul className={styles.gallery}>
            {photos.map((photo) => (
              <li key={photo.id} className={styles.photo}>
                <Image
                  src={photo.url}
                  alt={photo.altText}
                  width={960}
                  height={640}
                  className={styles.photoImage}
                  sizes="(max-width: 900px) 100vw, 640px"
                  unoptimized
                />
                {photo.caption ? (
                  <p className={styles.caption}>{photo.caption}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {space.mapUrl ? (
        <section className={styles.block} aria-labelledby="map-heading">
          <h2 id="map-heading" className={styles.heading}>
            Location
          </h2>
          <ExternalLink href={space.mapUrl}>Open in maps</ExternalLink>
        </section>
      ) : null}
    </article>
  );
}
