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
  return (
    <SectionShell
      id="latest-stories"
      eyebrow="Stories"
      title="Latest stories"
      lead="Recent published updates from across the NAC network."
    >
      {stories.length === 0 ? (
        <EmptyState
          title="No stories yet"
          message="Published articles will appear here when they are available."
        />
      ) : (
        <ul className={styles.list}>
          {stories.map((story) => (
            <li key={story.id} className={styles.item}>
              {story.imageUrl ? (
                <div className={styles.media}>
                  <Image
                    src={story.imageUrl}
                    alt={story.imageAlt ?? ""}
                    fill
                    sizes="(max-width: 700px) 100vw, 320px"
                    className={styles.image}
                  />
                </div>
              ) : null}
              <div className={styles.copy}>
                <h3 className={styles.title}>
                  <Link href={`/news/${story.slug}`}>{story.title}</Link>
                </h3>
                <p className={styles.excerpt}>{story.excerpt}</p>
                <Link className={styles.more} href={`/news/${story.slug}`}>
                  Read more
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
