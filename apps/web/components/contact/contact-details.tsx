import { telHref, type ContactSettings } from "@/lib/contact-data";
import styles from "./contact-details.module.css";

type Props = {
  contact: ContactSettings;
};

export function ContactDetails({ contact }: Props) {
  const phones = [contact.phone, contact.phoneAlt].filter((v) => v.trim());

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

      {phones.length > 0 || contact.tollFree.trim() || contact.email.trim() ? (
        <div className={styles.block}>
          <h3 className={styles.label}>Call &amp; mail</h3>
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
          </ul>
        </div>
      ) : null}
    </section>
  );
}
