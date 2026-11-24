import type { DocumentCategory } from "@/lib/downloads-data";
import styles from "./document-filters.module.css";

type Props = {
  categories: DocumentCategory[];
  activeSlug: string;
};

export function DocumentFilters({ categories, activeSlug }: Props) {
  return (
    <nav className={styles.nav} aria-label="Filter by category">
      <ul className={styles.list}>
        <li>
          <a
            className={!activeSlug ? styles.active : styles.link}
            href="/downloads"
            aria-current={!activeSlug ? "page" : undefined}
          >
            All
          </a>
        </li>
        {categories.map((category) => {
          const active = activeSlug === category.slug;
          return (
            <li key={category.id}>
              <a
                className={active ? styles.active : styles.link}
                href={`/downloads?category=${category.slug}`}
                aria-current={active ? "page" : undefined}
              >
                {category.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
