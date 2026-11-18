import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
      <SiteHeader />
      <main id="main" className={styles.main}>
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
