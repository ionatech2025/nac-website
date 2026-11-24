import Link from "next/link";
import { ExternalLink } from "./external-link";
import { LatestDownloads } from "./latest-downloads";
import { whatsappHref, type SiteSettings } from "@/lib/site-settings";
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
  const whatsapp = whatsappHref(settings.whatsapp);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.org}>{settings.orgName}</p>
          <p className={styles.tagline}>{settings.tagline}</p>
          <p className={styles.copy}>{settings.copyright}</p>
          <p className={styles.legal}>
            <Link href="/privacy">Privacy notice</Link>
          </p>
        </div>

        <div>
          <h2 className={styles.heading}>Visit &amp; contact</h2>
          {settings.address.trim() ? (
            <p className={styles.body}>{settings.address}</p>
          ) : null}
          {settings.postal.trim() ? (
            <p className={styles.body}>{settings.postal}</p>
          ) : null}
          <ul className={styles.list}>
            {settings.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
              </li>
            ))}
            {settings.tollFree.trim() ? (
              <li>
                Toll free:{" "}
                <a href={`tel:${settings.tollFree.replace(/\s+/g, "")}`}>
                  {settings.tollFree}
                </a>
              </li>
            ) : null}
            {settings.email.trim() ? (
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <ExternalLink href={whatsapp}>Chat on WhatsApp</ExternalLink>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          {settings.social.length > 0 ? (
            <>
              <h2 className={styles.heading}>Connect</h2>
              <ul className={styles.list} aria-label="Social media profiles">
                {settings.social.map((item) => (
                  <li key={item.href}>
                    <ExternalLink href={item.href}>{item.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {settings.external.length > 0 ? (
            <>
              <h2 className={styles.heading}>Partner tools</h2>
              <ul className={styles.list} aria-label="Partner tools">
                {settings.external.map((item) => (
                  <li key={item.href}>
                    <ExternalLink href={item.href}>{item.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div>
          <LatestDownloads downloads={downloads} />
        </div>
      </div>
    </footer>
  );
}
