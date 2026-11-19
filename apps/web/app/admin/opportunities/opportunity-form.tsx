import type { Opportunity, OpportunityType } from "@repo/database";
import {
  deriveOpportunityStatus,
  labelDerivedOpportunityStatus,
} from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
import {
  pdfUploadErrorMessage,
  type PdfUploadError,
} from "../../../lib/save-pdf-upload";
import { FileDrop } from "../_components/form/file-drop";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage, StatusCard } from "../_components/form/form-page";
import layoutStyles from "../_components/form/form-layout.module.css";
import { PreviewPanel } from "../_components/preview-panel";
import { createOpportunity, updateOpportunity } from "./actions";
import { OpportunityActionsBar } from "./opportunity-actions-bar";
import { OpportunityAttachments } from "./opportunity-attachments";
import { OpportunityContactFields } from "./opportunity-contact-fields";

type AttachmentRow = {
  id: string;
  title: string | null;
  media: { url: string; fileName: string; byteSize: number };
};

type OppWithRelations = Opportunity & {
  type: OpportunityType | null;
  attachments: AttachmentRow[];
};

type Props = {
  opportunity?: OppWithRelations;
  types: OpportunityType[];
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") return "Check the required fields and try again.";
  if (error.startsWith("pdf-")) {
    return pdfUploadErrorMessage(error.replace("pdf-", "") as PdfUploadError);
  }
  return "Something went wrong. Try again.";
}

export function OpportunityForm({
  opportunity: opp,
  types,
  error,
  saved,
}: Props) {
  const isEdit = Boolean(opp);
  const action = isEdit
    ? updateOpportunity.bind(null, opp!.id)
    : createOpportunity;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);
  const derived = opp
    ? labelDerivedOpportunityStatus(deriveOpportunityStatus(opp))
    : "—";

  return (
    <FormPage
      backHref="/admin/opportunities"
      backLabel="Opportunities"
      title={isEdit ? "Edit opportunity" : "New opportunity"}
      description="Jobs, grants and calls listed on the public Opportunities page."
      status={opp?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={opp?.updatedAt}>
            {opp ? (
              <>
                <p className={layoutStyles.note}>
                  Listing: <strong>{derived}</strong> (Africa/Kampala)
                </p>
                <OpportunityActionsBar
                  id={opp.id}
                  status={opp.status}
                  manualStatus={opp.manualStatus}
                />
              </>
            ) : null}
          </StatusCard>
          {opp ? (
            <PreviewPanel
              title={opp.title}
              lines={[
                { label: "Listing status", value: derived },
                { label: "Type", value: opp.type?.name ?? "" },
                { label: "Contact", value: opp.contactEmail ?? "" },
                { label: "Attachments", value: String(opp.attachments.length) },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="What the opportunity is and who it is for.">
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="e.g. Programme Officer – Gulu"
              defaultValue={opp?.title ?? ""}
            />
          </Field>
          <Field label="Slug" optional full hint="Generated from the title if left empty.">
            <input
              name="slug"
              placeholder="programme-officer-gulu"
              defaultValue={opp?.slug ?? ""}
            />
          </Field>
          <Field label="Type" optional>
            <select name="typeId" defaultValue={opp?.typeId ?? ""}>
              <option value="">— None —</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Or create type" optional>
            <input name="newTypeName" placeholder="New type name" />
          </Field>
          <Field label="Description" full hint={RICH_TEXT_HINT}>
            <textarea
              name="description"
              required
              placeholder="Describe the opportunity"
              defaultValue={opp?.description ?? ""}
            />
          </Field>
          <Field label="Application instructions" optional full>
            <textarea
              name="applicationInstructions"
              placeholder="How should applicants apply?"
              defaultValue={opp?.applicationInstructions ?? ""}
            />
          </Field>
        </FormSection>

        <OpportunityContactFields opp={opp} />

        <FormSection title="Add attachments" single>
          <Field label="PDF attachments" optional group>
            <FileDrop
              name="attachments"
              accept="application/pdf,.pdf"
              kind="pdf"
              multiple
              hint={`PDF only · up to ${maxMb} MB each`}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/opportunities"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>

      {opp ? (
        <OpportunityAttachments
          opportunityId={opp.id}
          attachments={opp.attachments}
        />
      ) : null}
    </FormPage>
  );
}
