import type { SlideshowImage } from "@repo/database";
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
  archiveSlide,
  createSlide,
  publishSlide,
  unpublishSlide,
  updateSlide,
} from "./actions";

type SlideWithMedia = SlideshowImage & {
  media: { url: string; altText: string | null };
};

type Props = {
  slide?: SlideWithMedia;
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Check fields and link (http(s) or /path) and try again.";
  }
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(
      error.replace("image-", "") as ImageUploadError,
    );
  }
  return "Something went wrong. Try again.";
}

export function SlideForm({ slide, error, saved }: Props) {
  const isEdit = Boolean(slide);
  const action = isEdit ? updateSlide.bind(null, slide!.id) : createSlide;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <FormPage
      backHref="/admin/slideshow"
      backLabel="Slideshow"
      title={isEdit ? "Edit slide" : "New slide"}
      description="Images shown in the homepage hero slideshow."
      status={slide?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={slide?.updatedAt}>
            {slide ? (
              <CmsStatusActions
                status={slide.status}
                publish={publishSlide.bind(null, slide.id)}
                unpublish={unpublishSlide.bind(null, slide.id)}
                archive={archiveSlide.bind(null, slide.id)}
              />
            ) : null}
          </StatusCard>
          {slide ? (
            <PreviewPanel
              title={slide.caption || "Untitled slide"}
              lines={[
                { label: "Link", value: slide.destinationUrl ?? "" },
                { label: "Alt text", value: slide.altText ?? "" },
                { label: "Sort order", value: String(slide.sortOrder) },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection
          title="Image"
          description="Use a wide landscape photo, at least 1600px across."
          single
        >
          <Field label="Slide image" group>
            <FileDrop
              name="image"
              accept="image/jpeg,image/png,image/webp"
              required={!isEdit}
              currentUrl={slide?.media.url}
              hint={`JPEG, PNG or WebP · up to ${maxMb} MB`}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Caption & link"
          description="Text overlaid on the slide and where it leads."
        >
          <Field label="Caption" optional>
            <input
              name="caption"
              placeholder="e.g. Youth spaces across Uganda"
              defaultValue={slide?.caption ?? ""}
            />
          </Field>
          <Field label="Alt text" optional hint="Describe the image for screen readers.">
            <input
              name="altText"
              placeholder="e.g. Young people at a community event"
              defaultValue={slide?.altText ?? ""}
            />
          </Field>
          <Field label="Link" optional hint="Full URL or a site path like /about.">
            <input
              name="destinationUrl"
              placeholder="https://… or /page"
              defaultValue={slide?.destinationUrl ?? ""}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={slide?.sortOrder ?? 0}
              style={{ maxWidth: 160 }}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/slideshow"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
