import type { FeaturedConcept } from "@repo/database";
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
  archiveFeatured,
  createFeatured,
  publishFeatured,
  unpublishFeatured,
  updateFeatured,
} from "./actions";

type FeaturedWithImage = FeaturedConcept & {
  image: { url: string; altText: string | null } | null;
};

type Props = {
  concept?: FeaturedWithImage;
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Check title and destination (http(s) or /path) and try again.";
  }
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(
      error.replace("image-", "") as ImageUploadError,
    );
  }
  return "Something went wrong. Try again.";
}

export function FeaturedForm({ concept, error, saved }: Props) {
  const isEdit = Boolean(concept);
  const action = isEdit
    ? updateFeatured.bind(null, concept!.id)
    : createFeatured;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <FormPage
      backHref="/admin/featured"
      backLabel="Featured concepts"
      title={isEdit ? concept!.title : "New concept"}
      description="Highlighted concepts promoted on the homepage."
      status={concept?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={concept?.updatedAt}>
            {concept ? (
              <CmsStatusActions
                status={concept.status}
                publish={publishFeatured.bind(null, concept.id)}
                unpublish={unpublishFeatured.bind(null, concept.id)}
                archive={archiveFeatured.bind(null, concept.id)}
              />
            ) : null}
          </StatusCard>
          {concept ? (
            <PreviewPanel
              title={concept.title}
              lines={[
                { label: "Destination", value: concept.destinationUrl ?? "" },
                { label: "Image", value: concept.image ? "Uploaded" : "None" },
                { label: "Sort order", value: String(concept.sortOrder) },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection
          title="Details"
          description="The title and short summary shown on the card."
        >
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="e.g. Safe spaces for young people"
              defaultValue={concept?.title ?? ""}
            />
          </Field>
          <Field label="Summary" optional full>
            <textarea
              name="summary"
              placeholder="One or two sentences describing the concept"
              defaultValue={concept?.summary ?? ""}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Link & ordering"
          description="Where the card leads and its position on the page."
        >
          <Field label="Destination" optional hint="Full URL or a site path like /about.">
            <input
              name="destinationUrl"
              placeholder="https://… or /page"
              defaultValue={concept?.destinationUrl ?? ""}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={concept?.sortOrder ?? 0}
              style={{ maxWidth: 160 }}
            />
          </Field>
        </FormSection>

        <FormSection title="Image" single>
          <Field label="Card image" optional group>
            <FileDrop
              name="image"
              accept="image/jpeg,image/png,image/webp"
              currentUrl={concept?.image?.url}
              hint={`JPEG, PNG or WebP · up to ${maxMb} MB`}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/featured"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
