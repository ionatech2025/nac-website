import type { Partner } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import {
  imageUploadErrorMessage,
  type ImageUploadError,
} from "../../../lib/save-image-upload";
import { CmsStatusActions } from "../_components/cms-status-actions";
import { FileDrop } from "../_components/form/file-drop";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage, StatusCard } from "../_components/form/form-page";
import { PreviewPanel } from "../_components/preview-panel";
import {
  archivePartner,
  createPartner,
  publishPartner,
  unpublishPartner,
  updatePartner,
} from "./actions";

type PartnerWithLogo = Partner & {
  logo: { url: string; altText: string | null } | null;
};

type Props = {
  partner?: PartnerWithLogo;
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Check name and link (http(s) or /path) and try again.";
  }
  if (error.startsWith("logo-")) {
    return imageUploadErrorMessage(
      error.replace("logo-", "") as ImageUploadError,
    );
  }
  return "Something went wrong. Try again.";
}

export function PartnerForm({ partner, error, saved }: Props) {
  const isEdit = Boolean(partner);
  const action = isEdit ? updatePartner.bind(null, partner!.id) : createPartner;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <FormPage
      backHref="/admin/partners"
      backLabel="Partners"
      title={isEdit ? partner!.name : "New partner"}
      description="Organisations shown in the partners strip on the website."
      status={partner?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={partner?.updatedAt}>
            {partner ? (
              <CmsStatusActions
                status={partner.status}
                publish={publishPartner.bind(null, partner.id)}
                unpublish={unpublishPartner.bind(null, partner.id)}
                archive={archivePartner.bind(null, partner.id)}
              />
            ) : null}
          </StatusCard>
          {partner ? (
            <PreviewPanel
              title={partner.name}
              lines={[
                { label: "Link", value: partner.websiteUrl ?? "" },
                { label: "Logo", value: partner.logo ? "Uploaded" : "None" },
                { label: "Sort order", value: String(partner.sortOrder) },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection
          title="Details"
          description="Partner name, where the logo links to, and its position."
        >
          <Field label="Name">
            <input
              name="name"
              required
              placeholder="e.g. UNICEF Uganda"
              defaultValue={partner?.name ?? ""}
            />
          </Field>
          <Field label="Website / link" optional hint="Full URL or a site path like /about.">
            <input
              name="websiteUrl"
              placeholder="https://… or /page"
              defaultValue={partner?.websiteUrl ?? ""}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={partner?.sortOrder ?? 0}
              style={{ maxWidth: 160 }}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Logo"
          description="A transparent PNG on a wide canvas works best."
          single
        >
          <Field label="Logo image" group>
            <FileDrop
              name="logo"
              accept="image/jpeg,image/png,image/webp"
              required={!isEdit}
              currentUrl={partner?.logo?.url}
              hint={`JPEG, PNG or WebP · up to ${maxMb} MB`}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/partners"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
