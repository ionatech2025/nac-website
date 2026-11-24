import type { Metadata } from "next";
import Link from "next/link";
import styles from "./galleries.module.css";

export const metadata: Metadata = {
  title: "Galleries",
  description:
    "Browse NAC photo albums and video embeds from allowlisted providers.",
};

export default function GalleriesPage() {
  return (
    <section className={styles.page} aria-labelledby="galleries-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="galleries-heading" className={styles.title}>
        Galleries
      </h1>
      <p className={styles.lead}>
        Photos and videos from youth spaces, forums and network activity across
        Uganda.
      </p>
      <ul className={styles.links}>
        <li>
          <Link className={styles.card} href="/galleries/photos">
            <span className={styles.cardTitle}>Photo Gallery</span>
            <span className={styles.cardCopy}>
              Albums in a responsive grid with captions and a lightbox.
            </span>
          </Link>
        </li>
        <li>
          <Link className={styles.card} href="/galleries/videos">
            <span className={styles.cardTitle}>Video Gallery</span>
            <span className={styles.cardCopy}>
              Embedded playback from YouTube and Vimeo only.
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
