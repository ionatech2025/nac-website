import type { Opportunity } from "@repo/database";
import { Field, FormSection } from "../_components/form/form-fields";

function ymd(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export function OpportunityContactFields({ opp }: { opp?: Opportunity }) {
  return (
    <>
      <FormSection
        title="Dates"
        description="The listing opens and closes automatically on these days."
      >
        <Field label="Opening date" optional>
          <input
            name="openingDate"
            type="date"
            defaultValue={ymd(opp?.openingDate)}
          />
        </Field>
        <Field label="Closing date" optional>
          <input
            name="closingDate"
            type="date"
            defaultValue={ymd(opp?.closingDate)}
          />
        </Field>
      </FormSection>

      <FormSection title="Contact" description="Where applicants send questions.">
        <Field label="Contact email">
          <input
            name="contactEmail"
            type="email"
            required
            placeholder="contact@example.org"
            defaultValue={opp?.contactEmail ?? ""}
          />
        </Field>
        <Field label="Contact phone" optional>
          <input
            name="contactPhone"
            placeholder="+256…"
            defaultValue={opp?.contactPhone ?? ""}
          />
        </Field>
      </FormSection>
    </>
  );
}
