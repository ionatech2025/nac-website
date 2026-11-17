import type { VideoLink } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import {
  imageUploadErrorMessage,
  type ImageUploadError,
} from "../../../lib/save-image-upload";
import { videoProviderErrorMessage } from "../../../lib/video-provider";
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
  archiveVideo,
  createVideo,
  publishVideo,
  unpublishVideo,
  updateVideo,
} from "./actions";

type VideoWithThumb = VideoLink & {
  thumbnailMedia: { url: string; altText: string | null } | null;
};

type Props = {
  video?: VideoWithThumb;
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") return "Check the required fields and try again.";
  if (error.startsWith("url-")) {
    return videoProviderErrorMessage(error.replace("url-", ""));
  }
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(
      error.replace("image-", "") as ImageUploadError,
    );
  }
  return "Something went wrong. Try again.";
}

export function VideoForm({ video, error, saved }: Props) {
  const isEdit = Boolean(video);
  const action = isEdit ? updateVideo.bind(null, video!.id) : createVideo;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <FormPage
      backHref="/admin/videos"
      backLabel="Videos"
      title={isEdit ? "Edit video" : "New video"}
      description="YouTube or Vimeo links shown on the public Videos page — no embed HTML."
      status={video?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={video?.updatedAt}>
            {video ? (
              <CmsStatusActions
                status={video.status}
                publish={publishVideo.bind(null, video.id)}
                unpublish={unpublishVideo.bind(null, video.id)}
                archive={archiveVideo.bind(null, video.id)}
              />
            ) : null}
          </StatusCard>
          {video ? (
            <PreviewPanel
              title={video.title}
              lines={[
                { label: "Provider", value: String(video.provider) },
                { label: "URL", value: video.url },
                { label: "Thumbnail", value: video.thumbnailMedia ? "Uploaded" : "None" },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="What the video is called and what it covers.">
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="e.g. HIV prevention campaign launch"
              defaultValue={video?.title ?? ""}
            />
          </Field>
          <Field label="Description" optional full>
            <textarea
              name="description"
              placeholder="A short summary shown under the video"
              defaultValue={video?.description ?? ""}
            />
          </Field>
        </FormSection>

        <FormSection title="Video link" description="Paste a YouTube or Vimeo page URL.">
          <Field label="Video URL" full>
            <input
              name="url"
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…"
              defaultValue={video?.url ?? ""}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={video?.sortOrder ?? 0}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Thumbnail"
          description="An optional custom preview image for the video card."
          single
        >
          <Field label="Thumbnail image" optional group>
            <FileDrop
              name="thumbnail"
              accept="image/jpeg,image/png,image/webp"
              currentUrl={video?.thumbnailMedia?.url}
              hint={`JPEG, PNG or WebP · up to ${maxMb} MB`}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/videos"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
