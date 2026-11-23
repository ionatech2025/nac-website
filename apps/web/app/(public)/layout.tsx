import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { getSiteSettings } from "@/lib/site-settings";
import styles from "./public.module.css";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className={styles.shell}>
      <SkipLink />
      <SiteHeader />
      <main id="main" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
