import {
  ensureSiteSettings,
  getPublicSiteSettings,
} from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { FormPage, AsideCard } from "../_components/form/form-page";
import {
  ContactSettingsForm,
  ExternalSettingsForm,
  SocialSettingsForm,
} from "./settings-forms";
import styles from "./settings.module.css";

type Props = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const ERRORS: Record<string, string> = {
  contact: "Check the contact fields. Email must be valid if set.",
  social: "Social links must be empty or start with http:// or https://.",
  external: "External links must be empty or start with http:// or https://.",
};

const SAVED: Record<string, string> = {
  contact: "Contact details saved.",
  social: "Social links saved.",
  external: "External links saved.",
};

function filled(value: string): boolean {
  return value.trim().length > 0;
}

export default async function SiteSettingsPage({ searchParams }: Props) {
  await requireAdmin();
  const query = await searchParams;
  await ensureSiteSettings();
  const settings = await getPublicSiteSettings();

  const socialCount = Object.values(settings.social).filter(filled).length;
  const contactBits = [
    settings.contact.email && "email",
    settings.contact.phone && "phone",
    settings.contact.whatsapp && "WhatsApp",
  ].filter(Boolean);

  return (
    <FormPage
      backHref="/admin"
      backLabel="Dashboard"
      title="Site settings"
      description="Contact details, social profiles and external service links used across the public site."
      error={query.error ? ERRORS[query.error] ?? "Could not save." : null}
      saved={Boolean(query.saved)}
      aside={
        <>
          <AsideCard title="What visitors see">
            <ul className={styles.asideList}>
              <li>
                Contact page and footer read these values — nothing is hard-coded.
              </li>
              <li>
                Empty fields are hidden, so leave a social network blank if NAC
                does not use it.
              </li>
              <li>
                External links default to youthgobudgetapp.org and slogbaa.org;
                change them here if the URLs move.
              </li>
            </ul>
          </AsideCard>
          <AsideCard title="Currently set">
            <dl className={styles.stats}>
              <div>
                <dt>Contact</dt>
                <dd>{contactBits.length ? contactBits.join(", ") : "Not filled in yet"}</dd>
              </div>
              <div>
                <dt>Social profiles</dt>
                <dd>{socialCount} of 6 filled</dd>
              </div>
              <div>
                <dt>Youth Go Budget</dt>
                <dd className={styles.mono}>
                  {settings.external.youthGoBudget || "—"}
                </dd>
              </div>
              <div>
                <dt>SLOGBAA</dt>
                <dd className={styles.mono}>{settings.external.slogbaa || "—"}</dd>
              </div>
            </dl>
            {query.saved && SAVED[query.saved] ? (
              <p className={styles.asideNote}>{SAVED[query.saved]}</p>
            ) : null}
          </AsideCard>
        </>
      }
    >
      <div className={styles.stack}>
        <ContactSettingsForm contact={settings.contact} />
        <SocialSettingsForm social={settings.social} />
        <ExternalSettingsForm external={settings.external} />
      </div>
    </FormPage>
  );
}
