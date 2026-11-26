import Link from "next/link";
import { EmptyState } from "@/components/content-states";
import { ExternalLink } from "@/components/external-link";
import type { FeaturedConceptItem } from "@/lib/home-data";
import { SectionShell } from "./section-shell";
import styles from "./featured-concepts.module.css";

type Props = {
  concepts: FeaturedConceptItem[];
};

function ConceptLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return <ExternalLink href={href}>{children}</ExternalLink>;
  }
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  );
}

export function FeaturedConcepts({ concepts }: Props) {
  return (
    <SectionShell
      id="featured-concepts"
      eyebrow="Pathways"
      title="Where to start"
      lead="Programmes and themes visitors ask about most."
      tone="band"
      action={<Link href="/programs">All programmes</Link>}
    >
      {concepts.length === 0 ? (
        <EmptyState title="No featured concepts yet" />
      ) : (
        <ul className={styles.list}>
          {concepts.map((concept, index) => (
            <li key={concept.id} className={styles.item}>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.title}>
                  {concept.destinationUrl ? (
                    <ConceptLink href={concept.destinationUrl}>
                      {concept.title}
                    </ConceptLink>
                  ) : (
                    concept.title
                  )}
                </h3>
                {concept.summary ? (
                  <p className={styles.summary}>{concept.summary}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
