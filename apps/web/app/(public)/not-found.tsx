import Link from "next/link";
import styles from "@/components/page-placeholder.module.css";
import stateStyles from "@/components/content-states.module.css";

export default function PublicNotFound() {
  return (
    <section className={styles.section} aria-labelledby="missing-title">
      <p className={styles.kicker}>Page not found</p>
      <h1 id="missing-title" className={styles.title}>
        We can’t find that page
      </h1>
      <p className={styles.lead}>
        The link may be outdated, or the page may have moved. Use the menu or
        head back home to keep exploring NAC.
      </p>
      <div className={stateStyles.actions}>
        <Link className={stateStyles.primary} href="/">
          Back to home
        </Link>
        <Link className={stateStyles.secondary} href="/about">
          About NAC
        </Link>
        <Link className={stateStyles.secondary} href="/contact">
          Contact us
        </Link>
      </div>
    </section>
  );
}
