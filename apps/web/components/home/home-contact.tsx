import Link from "next/link";
import type { SiteSettings } from "@/lib/site-settings";
import styles from "./home-contact.module.css";

type Props = {
  settings: SiteSettings;
};

export function HomeContactSummary({ settings }: Props) {
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
            <p className={styles.copy}>{settings.address}</p>
            <p className={styles.copy}>{settings.postal}</p>
          </div>
          <div>
            <h3 className={styles.label}>Call &amp; mail</h3>
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
            <Link className={styles.cta} href="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
