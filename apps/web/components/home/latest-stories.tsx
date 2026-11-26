import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/content-states";
import type { HomeStory } from "@/lib/home-data";
import { SectionShell } from "./section-shell";
import styles from "./latest-stories.module.css";

type Props = {
  stories: HomeStory[];
};

export function LatestStories({ stories }: Props) {
  const [featured, ...rest] = stories;

  return (
    <SectionShell
      id="latest-stories"
      eyebrow="Stories"
      title="Latest from the network"
      lead="Recent published updates from across NAC."
      tone="tint"
      action={<Link href="/news">All news</Link>}
    >
      {stories.length === 0 ? (
        <EmptyState
          title="No stories yet"
          message="Published articles will appear here when they are available."
        />
      ) : (
        <div className={styles.layout}>
          {featured ? (
            <article className={styles.featured}>
              {featured.imageUrl ? (
                <div className={styles.featuredMedia}>
                  <Image
                    src={featured.imageUrl}
                    alt={featured.imageAlt ?? ""}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    className={styles.image}
                  />
                </div>
              ) : null}
              <div className={styles.copy}>
                <h3 className={styles.title}>
                  <Link href={`/news/${featured.slug}`}>{featured.title}</Link>
                </h3>
                <p className={styles.excerpt}>{featured.excerpt}</p>
                <Link className={styles.more} href={`/news/${featured.slug}`}>
                  Read story
                </Link>
              </div>
            </article>
          ) : null}

          {rest.length > 0 ? (
            <ul className={styles.list}>
              {rest.map((story) => (
                <li key={story.id} className={styles.item}>
                  {story.imageUrl ? (
                    <div className={styles.media}>
                      <Image
                        src={story.imageUrl}
                        alt={story.imageAlt ?? ""}
                        fill
                        sizes="(max-width: 700px) 100vw, 280px"
                        className={styles.image}
                      />
                    </div>
                  ) : null}
                  <div className={styles.copy}>
                    <h3 className={styles.smallTitle}>
                      <Link href={`/news/${story.slug}`}>{story.title}</Link>
                    </h3>
                    <p className={styles.excerpt}>{story.excerpt}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </SectionShell>
  );
}
