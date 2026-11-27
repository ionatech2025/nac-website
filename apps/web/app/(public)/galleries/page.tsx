import type { Metadata } from "next";
import Link from "next/link";
import { MediaTabs } from "@/components/galleries/media-tabs";
import { publicPageMetadata } from "@/lib/page-metadata";
import styles from "./galleries.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Media Center",
  description:
    "Explore NAC photos, videos, and documents from programmes, youth spaces, and network events.",
  path: "/galleries",
});

export default function GalleriesPage() {
  return (
    <section className={styles.page} aria-labelledby="media-heading">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Network for Active Citizens</p>
          <h1 id="media-heading" className={styles.title}>
            Media Center
          </h1>
          <p className={styles.lead}>
            Explore our gallery of photos, videos, and documents from NAC
            programmes, youth spaces, and network events.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <MediaTabs active="photos" />
        <ul className={styles.preview}>
          <li>
            <Link className={styles.card} href="/galleries/photos">
              <span className={styles.cardTitle}>Photos</span>
              <span className={styles.cardCopy}>
                Albums from youth spaces, forums, and community action across
                Uganda.
              </span>
            </Link>
          </li>
          <li>
            <Link className={styles.card} href="/galleries/videos">
              <span className={styles.cardTitle}>Videos</span>
              <span className={styles.cardCopy}>
                Embedded stories and programme films from YouTube and Vimeo.
              </span>
            </Link>
          </li>
          <li>
            <Link className={styles.card} href="/downloads">
              <span className={styles.cardTitle}>Documents</span>
              <span className={styles.cardCopy}>
                Reports, plans, and resources available for download.
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
