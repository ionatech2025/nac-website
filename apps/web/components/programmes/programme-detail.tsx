import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/content-states";
import { ExternalLink } from "@/components/external-link";
import { LatestDownloads } from "@/components/latest-downloads";
import { RichText } from "@/lib/rich-text-view";
import type { ProgrammeDetail as ProgrammeDetailType } from "@/lib/programmes-data";
import styles from "./programme-detail.module.css";

type Props = {
  programme: ProgrammeDetailType;
};

export function ProgrammeDetailView({ programme }: Props) {
  const hero = programme.images[0] ?? programme.cover;

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/programs">Programs</Link>
      </p>
      <h1 className={styles.title}>{programme.title}</h1>
      {programme.summary ? (
        <p className={styles.summary}>{programme.summary}</p>
      ) : null}

      {hero ? (
        <div className={styles.hero}>
          <Image
            src={hero.url}
            alt={hero.altText}
            width={960}
            height={540}
            className={styles.heroImage}
            sizes="(max-width: 900px) 100vw, 900px"
            unoptimized
            priority
          />
        </div>
      ) : null}

      <RichText text={programme.body} className={styles.body} />

      {programme.strategies.length > 0 ? (
        <section className={styles.block} aria-labelledby="strategies-heading">
          <h2 id="strategies-heading" className={styles.heading}>
            Strategies and activities
          </h2>
          <ol className={styles.strategies}>
            {programme.strategies.map((strategy) => (
              <li key={strategy.id} className={styles.strategy}>
                <h3 className={styles.strategyTitle}>{strategy.title}</h3>
                <RichText text={strategy.body} className={styles.strategyBody} />
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {programme.externalLinks.length > 0 ? (
        <section className={styles.block} aria-labelledby="tools-heading">
          <h2 id="tools-heading" className={styles.heading}>
            Related tools
          </h2>
          <ul className={styles.links}>
            {programme.externalLinks.map((link) => (
              <li key={link.href}>
                <ExternalLink href={link.href}>{link.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {programme.linksToYouthSpaces ? (
        <section className={styles.cta} aria-labelledby="spaces-cta-heading">
          <h2 id="spaces-cta-heading" className={styles.heading}>
            Explore Youth Spaces
          </h2>
          <p className={styles.ctaCopy}>
            See the physical youth spaces NAC works with across Uganda.
          </p>
          <Link className={styles.ctaLink} href="/youth-spaces">
            Browse Youth Spaces
          </Link>
        </section>
      ) : null}

      <section className={styles.block} aria-labelledby="related-stories">
        <h2 id="related-stories" className={styles.heading}>
          Related stories
        </h2>
        {programme.relatedStories.length === 0 ? (
          <EmptyState title="No related stories for this programme yet." />
        ) : (
          <ul className={styles.links}>
            {programme.relatedStories.map((story) => (
              <li key={story.id}>
                <Link href={`/news/${story.slug}`}>{story.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.block} aria-labelledby="related-downloads">
        <h2 id="related-downloads" className={styles.heading}>
          Related downloads
        </h2>
        {programme.relatedDownloads.length === 0 ? (
          <EmptyState title="No related downloads for this programme yet." />
        ) : (
          <LatestDownloads
            heading="Available now"
            downloads={programme.relatedDownloads.map((file) => ({
              id: file.id,
              title: file.title,
              href: file.href,
              byteSize: file.byteSize,
              fileType: file.fileType,
            }))}
          />
        )}
      </section>
    </article>
  );
}
