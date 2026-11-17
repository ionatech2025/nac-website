import type { TeamMember } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
import { imageUploadErrorMessage } from "../../../lib/save-image-upload";
import type { ImageUploadError } from "../../../lib/save-image-upload";
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
  archiveTeamMember,
  createTeamMember,
  publishTeamMember,
  unpublishTeamMember,
  updateTeamMember,
} from "./actions";

type MemberWithPhoto = TeamMember & {
  photo: { url: string; altText: string | null } | null;
};

type Props = {
  member?: MemberWithPhoto;
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Check the required fields and try again.";
  }
  if (error.startsWith("photo-")) {
    const code = error.replace("photo-", "") as ImageUploadError;
    return imageUploadErrorMessage(code);
  }
  return "Something went wrong. Try again.";
}

export function TeamForm({ member, error, saved }: Props) {
  const isEdit = Boolean(member);
  const action = isEdit
    ? updateTeamMember.bind(null, member!.id)
    : createTeamMember;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <FormPage
      backHref="/admin/team"
      backLabel="Team"
      title={isEdit ? member!.name : "New team member"}
      description={
        isEdit
          ? "Update this person's profile on the About page."
          : "Add a person to the team section of the About page."
      }
      status={member?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={member?.updatedAt}>
            {member ? (
              <CmsStatusActions
                status={member.status}
                publish={publishTeamMember.bind(null, member.id)}
                unpublish={unpublishTeamMember.bind(null, member.id)}
                archive={archiveTeamMember.bind(null, member.id)}
              />
            ) : null}
          </StatusCard>
          {member ? (
            <PreviewPanel
              title={member.name}
              lines={[
                { label: "Role", value: member.roleTitle },
                { label: "Photo", value: member.photo ? "Uploaded" : "None" },
                { label: "Sort order", value: String(member.sortOrder) },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection
          title="Profile"
          description="Name, role and a short biography."
        >
          <Field label="Full name">
            <input
              name="name"
              required
              placeholder="e.g. Jane Namuli"
              defaultValue={member?.name ?? ""}
            />
          </Field>
          <Field label="Role">
            <input
              name="roleTitle"
              required
              placeholder="e.g. Programme Officer"
              defaultValue={member?.roleTitle ?? ""}
            />
          </Field>
          <Field label="Biography" optional full hint={RICH_TEXT_HINT}>
            <textarea
              name="biography"
              placeholder="A few sentences about their work and background"
              defaultValue={member?.biography ?? ""}
            />
          </Field>
        </FormSection>

        <FormSection title="Photo & ordering" single>
          <Field label="Profile photo" group>
            <FileDrop
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              required={!isEdit}
              currentUrl={member?.photo?.url}
              hint={`JPEG, PNG or WebP · up to ${maxMb} MB`}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={member?.sortOrder ?? 0}
              style={{ maxWidth: 160 }}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/team"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
