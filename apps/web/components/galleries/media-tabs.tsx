import Link from "next/link";
import styles from "./media-tabs.module.css";

export type MediaTab = "photos" | "videos" | "documents" | "news";

type Props = {
  active: MediaTab;
};

const TABS: { id: MediaTab; label: string; href: string }[] = [
  { id: "photos", label: "Photos", href: "/galleries/photos" },
  { id: "videos", label: "Videos", href: "/galleries/videos" },
  { id: "documents", label: "Documents", href: "/downloads" },
  { id: "news", label: "Blogs & News", href: "/news" },
];

export function MediaTabs({ active }: Props) {
  return (
    <nav className={styles.wrap} aria-label="Media types">
      <ul className={styles.list}>
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id}>
              <Link
                href={tab.href}
                className={isActive ? styles.active : styles.tab}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
