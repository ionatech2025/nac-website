import type {
  ContactSettings,
  ExternalSettings,
  SocialSettings,
} from "@repo/database";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import {
  saveContactSettings,
  saveExternalSettings,
  saveSocialSettings,
} from "./actions";

export function ContactSettingsForm({ contact }: { contact: ContactSettings }) {
  return (
    <form action={saveContactSettings} className={formClass} id="contact">
      <FormSection
        title="Contact details"
        description="Shown on the Contact page and in the site footer."
      >
        <Field label="Physical address" optional full>
          <textarea
            name="physicalAddress"
            placeholder="Plot …, Street, Kampala, Uganda"
            defaultValue={contact.physicalAddress}
            style={{ minHeight: 72 }}
          />
        </Field>
        <Field label="Postal address" optional full>
          <textarea
            name="postalAddress"
            placeholder="P.O. Box …, Kampala"
            defaultValue={contact.postalAddress}
            style={{ minHeight: 72 }}
          />
        </Field>
        <Field label="Phone">
          <input name="phone" type="tel" placeholder="+256 …" defaultValue={contact.phone} />
        </Field>
        <Field label="Second phone" optional>
          <input name="phoneAlt" type="tel" placeholder="+256 …" defaultValue={contact.phoneAlt} />
        </Field>
        <Field label="Toll-free" optional>
          <input name="tollFree" type="tel" placeholder="0800 …" defaultValue={contact.tollFree} />
        </Field>
        <Field label="Email" optional>
          <input name="email" type="email" placeholder="info@nacuganda.org" defaultValue={contact.email} />
        </Field>
        <Field
          label="WhatsApp"
          optional
          full
          hint="International digits (2567…) or a https://wa.me/… link. Leave blank to hide WhatsApp buttons."
        >
          <input
            name="whatsapp"
            placeholder="2567XXXXXXXX or https://wa.me/2567XXXXXXXX"
            defaultValue={contact.whatsapp}
          />
        </Field>
      </FormSection>
      <FormFooter cancelHref="/admin" submitLabel="Save contact details" note="Changes go live as soon as you save." />
    </form>
  );
}

export function SocialSettingsForm({ social }: { social: SocialSettings }) {
  return (
    <form action={saveSocialSettings} className={formClass} id="social">
      <FormSection
        title="Social profiles"
        description="Footer icons. Leave a field blank to hide that network. Links must start with https://."
      >
        <Field label="Facebook" optional full>
          <input name="facebook" type="url" placeholder="https://facebook.com/…" defaultValue={social.facebook} />
        </Field>
        <Field label="X (Twitter)" optional full>
          <input name="x" type="url" placeholder="https://x.com/…" defaultValue={social.x} />
        </Field>
        <Field label="Instagram" optional full>
          <input name="instagram" type="url" placeholder="https://instagram.com/…" defaultValue={social.instagram} />
        </Field>
        <Field label="YouTube" optional full>
          <input name="youtube" type="url" placeholder="https://youtube.com/…" defaultValue={social.youtube} />
        </Field>
        <Field label="LinkedIn" optional full>
          <input name="linkedin" type="url" placeholder="https://linkedin.com/…" defaultValue={social.linkedin} />
        </Field>
        <Field label="TikTok" optional full>
          <input name="tiktok" type="url" placeholder="https://tiktok.com/@…" defaultValue={social.tiktok} />
        </Field>
      </FormSection>
      <FormFooter cancelHref="/admin" submitLabel="Save social links" note="Changes go live as soon as you save." />
    </form>
  );
}

export function ExternalSettingsForm({ external }: { external: ExternalSettings }) {
  return (
    <form action={saveExternalSettings} className={formClass} id="external">
      <FormSection
        title="External services"
        description="Youth Go Budget and SLOGBAA links in the footer and programme pages."
      >
        <Field label="Youth Go Budget" optional full hint="Usually https://youthgobudgetapp.org">
          <input
            name="youthGoBudget"
            type="url"
            placeholder="https://youthgobudgetapp.org"
            defaultValue={external.youthGoBudget}
          />
        </Field>
        <Field label="SLOGBAA" optional full hint="Usually https://slogbaa.org">
          <input
            name="slogbaa"
            type="url"
            placeholder="https://slogbaa.org"
            defaultValue={external.slogbaa}
          />
        </Field>
      </FormSection>
      <FormFooter cancelHref="/admin" submitLabel="Save external links" note="Changes go live as soon as you save." />
    </form>
  );
}
