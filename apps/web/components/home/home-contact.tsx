import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { whatsappHref, type SiteSettings } from "@/lib/site-settings";
import styles from "./home-contact.module.css";

type Props = {
  settings: SiteSettings;
};

export function HomeContactSummary({ settings }: Props) {
  const whatsapp = whatsappHref(settings.whatsapp);

  return (
    <section className={styles.section} aria-labelledby="home-contact-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Visit &amp; reach us</p>
        <h2 id="home-contact-heading" className={styles.title}>
          Contact and location
        </h2>
        <div className={styles.grid}>
          <div>
            <h3 className={styles.label}>Our location</h3>
            {settings.address.trim() ? (
              <p className={styles.copy}>{settings.address}</p>
            ) : null}
            {settings.postal.trim() ? (
              <p className={styles.copy}>{settings.postal}</p>
            ) : null}
          </div>
          <div>
            <h3 className={styles.label}>Call &amp; mail</h3>
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
            <Link className={styles.cta} href="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
