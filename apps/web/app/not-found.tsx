import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { defaultSiteSettings } from "@/lib/site-settings";
import styles from "./(public)/public.module.css";
import pageStyles from "@/components/page-placeholder.module.css";
import stateStyles from "@/components/content-states.module.css";

export default function RootNotFound() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main id="main" className={styles.main}>
        <section className={pageStyles.section} aria-labelledby="missing-title">
          <p className={pageStyles.kicker}>Page not found</p>
          <h1 id="missing-title" className={pageStyles.title}>
            We can’t find that page
          </h1>
          <p className={pageStyles.lead}>
            The link may be outdated, or the page may have moved.
          </p>
          <div className={stateStyles.actions}>
            <Link className={stateStyles.primary} href="/">
              Back to home
            </Link>
            <Link className={stateStyles.secondary} href="/contact">
              Contact us
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter settings={defaultSiteSettings} />
    </div>
  );
}
