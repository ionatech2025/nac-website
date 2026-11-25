import Link from "next/link";
import { ExternalLink } from "./external-link";
import {
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsApp,
  socialFooterIcon,
} from "./footer-icons";
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
          {/* eslint-disable-next-line @next/next/no-img-element -- same static brand asset as admin/login */}
          <img
            src="/brand/nac-logo.png"
            alt="Network for Active Citizens"
            width={160}
            height={160}
            className={styles.logo}
          />
          <p className={styles.org}>{settings.orgName}</p>
          <p className={styles.tagline}>{settings.tagline}</p>
          <p className={styles.copy}>{settings.copyright}</p>
          <p className={styles.legal}>
            <Link href="/privacy">Privacy notice</Link>
          </p>
        </div>

        <div>
          <h2 className={styles.heading}>Visit &amp; contact</h2>
          <ul className={styles.iconList}>
            {settings.address.trim() || settings.postal.trim() ? (
              <li>
                <IconMapPin className={styles.icon} />
                <span>
                  {settings.address.trim() ? settings.address : null}
                  {settings.address.trim() && settings.postal.trim() ? (
                    <br />
                  ) : null}
                  {settings.postal.trim() ? settings.postal : null}
                </span>
              </li>
            ) : null}
            {settings.phones.length > 0 || settings.tollFree.trim() ? (
              <li>
                <IconPhone className={styles.icon} />
                <span className={styles.stacked}>
                  {settings.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                    >
                      {phone}
                    </a>
                  ))}
                  {settings.tollFree.trim() ? (
                    <a href={`tel:${settings.tollFree.replace(/\s+/g, "")}`}>
                      Toll free: {settings.tollFree}
                    </a>
                  ) : null}
                </span>
              </li>
            ) : null}
            {settings.email.trim() ? (
              <li>
                <IconMail className={styles.icon} />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <IconWhatsApp className={styles.icon} />
                <ExternalLink href={whatsapp}>WhatsApp</ExternalLink>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          {settings.social.length > 0 ? (
            <>
              <h2 className={styles.heading}>Connect</h2>
              <ul className={styles.socialRow} aria-label="Social media profiles">
                {settings.social.map((item) => {
                  const Icon = socialFooterIcon(item.label);
                  return (
                    <li key={item.href}>
                      <ExternalLink
                        href={item.href}
                        className={styles.socialLink}
                        showMark={false}
                        aria-label={item.label}
                      >
                        <Icon className={styles.socialIcon} />
                      </ExternalLink>
                    </li>
                  );
                })}
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
