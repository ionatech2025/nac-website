import type { Metadata } from "next";
import Link from "next/link";
import { ContactDetails } from "@/components/contact/contact-details";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { getContactSettings } from "@/lib/contact-data";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Network for Active Citizens by phone, email or inquiry form.",
};

export default async function ContactPage() {
  const contact = await getContactSettings();

  return (
    <section className={styles.page} aria-labelledby="contact-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="contact-heading" className={styles.title}>
        Contact Us
      </h1>
      <p className={styles.lead}>
        Reach NAC offline using the details below, or send an inquiry through
        the form. For anonymous concerns, use the{" "}
        <Link href="/complaints">complaints page</Link>.
      </p>
      <div className={styles.layout}>
        <ContactDetails contact={contact} />
        <div className={styles.formColumn}>
          <InquiryForm />
          <p className={styles.complaintsNote}>
            Need to raise a concern without sharing your identity?{" "}
            <Link href="/complaints">Submit an anonymous complaint</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
