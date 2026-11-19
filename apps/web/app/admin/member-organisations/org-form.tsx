import type { MemberOrganisation } from "@repo/database";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
import {
  imageUploadErrorMessage,
  type ImageUploadError,
} from "../../../lib/save-image-upload";
import { CmsStatusActions } from "../_components/cms-status-actions";
import { Field, FormFooter, FormSection, formClass } from "../_components/form/form-fields";
import { FormPage, StatusCard } from "../_components/form/form-page";
import { PreviewPanel } from "../_components/preview-panel";
import {
  archiveMemberOrganisation,
  createMemberOrganisation,
  publishMemberOrganisation,
  unpublishMemberOrganisation,
  updateMemberOrganisation,
} from "./actions";
import { MAX_ORG_PHOTOS } from "./limits";
import { OrganisationPhotosPanel, type OrganisationPhoto } from "./org-photos";

type Props = {
  organisation?: MemberOrganisation & { images: OrganisationPhoto[] };
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Check the name, bio and website link (http:// or https://), then try again.";
  }
  if (error === "slug") return "Another organisation already uses that slug.";
  if (error === "images-missing") return "Choose at least one photo to upload.";
  if (error === "photos-max") {
    return `An organisation can have at most ${MAX_ORG_PHOTOS} photos. Remove one first.`;
  }
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(error.replace("image-", "") as ImageUploadError);
  }
  return "Something went wrong. Try again.";
}

export function OrganisationForm({ organisation, error, saved }: Props) {
  const isEdit = Boolean(organisation);
  const action = isEdit
    ? updateMemberOrganisation.bind(null, organisation!.id)
    : createMemberOrganisation;

  return (
    <FormPage
      backHref="/admin/member-organisations"
      backLabel="Member organisations"
      title={isEdit ? "Edit organisation" : "New organisation"}
      description="NAC network members shown on the public Member organisations pages."
      status={organisation?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={organisation?.updatedAt}>
            {organisation ? (
              <CmsStatusActions
                status={organisation.status}
                publish={publishMemberOrganisation.bind(null, organisation.id)}
                unpublish={unpublishMemberOrganisation.bind(null, organisation.id)}
                archive={archiveMemberOrganisation.bind(null, organisation.id)}
              />
            ) : null}
          </StatusCard>
          {organisation ? (
            <PreviewPanel
              title={organisation.name}
              lines={[
                { label: "Public URL", value: `/member-organisations/${organisation.slug}` },
                {
                  label: "Photos",
                  value: `${organisation.images.length} / ${MAX_ORG_PHOTOS}`,
                },
                {
                  label: "Website",
                  value: organisation.websiteUrl ? "Set" : "None",
                },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="Name, short bio and optional website.">
          <Field label="Name" full>
            <input
              name="name"
              required
              placeholder="e.g. Hope Alive Initiative"
              defaultValue={organisation?.name ?? ""}
            />
          </Field>
          <Field label="Slug" optional hint="Generated from the name if left empty.">
            <input
              name="slug"
              placeholder="hope-alive-initiative"
              defaultValue={organisation?.slug ?? ""}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={organisation?.sortOrder ?? 0}
            />
          </Field>
          <Field label="Website" optional full hint="http:// or https:// — hidden on the public page if empty.">
            <input
              name="websiteUrl"
              type="url"
              placeholder="https://example.org"
              defaultValue={organisation?.websiteUrl ?? ""}
            />
          </Field>
          <Field label="Short bio" full hint={RICH_TEXT_HINT}>
            <textarea
              name="bio"
              required
              placeholder="A short introduction to this member organisation…"
              defaultValue={organisation?.bio ?? ""}
              style={{ minHeight: 160 }}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/member-organisations"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>

      {organisation ? (
        <FormSection
          title="Photos"
          description={`Up to ${MAX_ORG_PHOTOS} photos. The first one is used on listing cards.`}
          single
        >
          <OrganisationPhotosPanel
            organisationId={organisation.id}
            images={organisation.images}
          />
        </FormSection>
      ) : null}
    </FormPage>
  );
}
