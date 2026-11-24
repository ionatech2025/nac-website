import { ExternalLink } from "@/components/external-link";
import {
  telHref,
  whatsappHref,
  type ContactSettings,
} from "@/lib/contact-data";
import styles from "./contact-details.module.css";

type Props = {
  contact: ContactSettings;
};

export function ContactDetails({ contact }: Props) {
  const phones = [contact.phone, contact.phoneAlt].filter((v) => v.trim());
  const whatsapp = whatsappHref(contact.whatsapp);

  return (
    <section className={styles.section} aria-labelledby="contact-details-heading">
      <h2 id="contact-details-heading" className={styles.heading}>
        Visit &amp; reach us
      </h2>

      {contact.physicalAddress.trim() ? (
        <div className={styles.block}>
          <h3 className={styles.label}>Physical address</h3>
          <p className={styles.copy}>{contact.physicalAddress}</p>
        </div>
      ) : null}

      {contact.postalAddress.trim() ? (
        <div className={styles.block}>
          <h3 className={styles.label}>Postal address</h3>
          <p className={styles.copy}>{contact.postalAddress}</p>
        </div>
      ) : null}

      {phones.length > 0 || contact.tollFree.trim() || contact.email.trim() || whatsapp ? (
        <div className={styles.block}>
          <h3 className={styles.label}>Call, mail &amp; chat</h3>
          <ul className={styles.list}>
            {phones.map((phone) => (
              <li key={phone}>
                <a href={telHref(phone)}>{phone}</a>
              </li>
            ))}
            {contact.tollFree.trim() ? (
              <li>
                Toll free:{" "}
                <a href={telHref(contact.tollFree)}>{contact.tollFree}</a>
              </li>
            ) : null}
            {contact.email.trim() ? (
              <li>
                <a href={`mailto:${contact.email.trim()}`}>{contact.email}</a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <ExternalLink href={whatsapp}>WhatsApp</ExternalLink>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
