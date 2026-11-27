import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { getPrimaryNav } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import styles from "./public.module.css";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, nav] = await Promise.all([
    getSiteSettings(),
    getPrimaryNav(),
  ]);

  return (
    <div className={styles.shell}>
      <SkipLink />
      <SiteHeader items={nav} />
      <main id="main" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
