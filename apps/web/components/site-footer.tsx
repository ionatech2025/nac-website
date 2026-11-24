import { ExternalLink } from "./external-link";
import { LatestDownloads } from "./latest-downloads";
import type { SiteSettings } from "@/lib/site-settings";
import styles from "./site-footer.module.css";

type Props = {
  settings: SiteSettings;
};

export function SiteFooter({ settings }: Props) {
  const downloads = settings.latestDownloads.map((file, index) => ({
    id: `footer-download-${index}`,
    title: file.title,
    href: file.href,
    byteSize: file.byteSize,
    fileType: file.fileType,
  }));

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.org}>{settings.orgName}</p>
          <p className={styles.tagline}>{settings.tagline}</p>
          <p className={styles.copy}>{settings.copyright}</p>
        </div>

        <div>
          <h2 className={styles.heading}>Visit &amp; contact</h2>
          <p className={styles.body}>{settings.address}</p>
          <p className={styles.body}>{settings.postal}</p>
          <ul className={styles.list}>
            {settings.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
              </li>
            ))}
            <li>
              Toll free:{" "}
              <a href={`tel:${settings.tollFree.replace(/\s+/g, "")}`}>
                {settings.tollFree}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Connect</h2>
          <ul className={styles.list}>
            {settings.social.map((item) => (
              <li key={item.href}>
                <ExternalLink href={item.href}>{item.label}</ExternalLink>
              </li>
            ))}
          </ul>
          <h2 className={styles.heading}>Partner tools</h2>
          <ul className={styles.list}>
            {settings.external.map((item) => (
              <li key={item.href}>
                <ExternalLink href={item.href}>{item.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <LatestDownloads downloads={downloads} />
        </div>
      </div>
    </footer>
  );
}
