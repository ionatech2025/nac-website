import type { PhotoAlbum } from "@repo/database";
import {
  imageUploadErrorMessage,
  type ImageUploadError,
} from "../../../lib/save-image-upload";
import { CmsStatusActions } from "../_components/cms-status-actions";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage, StatusCard } from "../_components/form/form-page";
import { PreviewPanel } from "../_components/preview-panel";
import {
  archiveAlbum,
  createAlbum,
  publishAlbum,
  unpublishAlbum,
  updateAlbum,
} from "./actions";
import { AlbumImagesPanel } from "./album-images";

type ImageRow = {
  id: string;
  caption: string | null;
  altText: string | null;
  sortOrder: number;
  media: { id: string; url: string; thumbUrl: string | null };
};

type AlbumWithImages = PhotoAlbum & { images: ImageRow[] };

type Props = {
  album?: AlbumWithImages;
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") return "Check the required fields and try again.";
  if (error === "images-missing") return "Choose at least one image to upload.";
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(
      error.replace("image-", "") as ImageUploadError,
    );
  }
  return "Something went wrong. Try again.";
}

export function AlbumForm({ album, error, saved }: Props) {
  const isEdit = Boolean(album);
  const action = isEdit ? updateAlbum.bind(null, album!.id) : createAlbum;

  return (
    <FormPage
      backHref="/admin/albums"
      backLabel="Albums"
      title={isEdit ? "Edit album" : "New album"}
      description="Photo albums shown in the public gallery."
      status={album?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={album?.updatedAt}>
            {album ? (
              <CmsStatusActions
                status={album.status}
                publish={publishAlbum.bind(null, album.id)}
                unpublish={unpublishAlbum.bind(null, album.id)}
                archive={archiveAlbum.bind(null, album.id)}
              />
            ) : null}
          </StatusCard>
          {album ? (
            <PreviewPanel
              title={album.title}
              lines={[
                { label: "Slug", value: album.slug },
                { label: "Photos", value: String(album.images.length) },
                { label: "Cover", value: album.coverMediaId ? "Selected" : "None" },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="The album name and its web address.">
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="e.g. World AIDS Day 2026"
              defaultValue={album?.title ?? ""}
            />
          </Field>
          <Field label="Slug" optional hint="Generated from the title if left empty.">
            <input
              name="slug"
              placeholder="world-aids-day-2026"
              defaultValue={album?.slug ?? ""}
            />
          </Field>
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={album?.sortOrder ?? 0}
            />
          </Field>
        </FormSection>

        {album && album.images.length > 0 ? (
          <FormSection
            title="Cover"
            description="The photo used on the album card."
            single
          >
            <Field label="Cover image" optional>
              <select name="coverMediaId" defaultValue={album.coverMediaId ?? ""}>
                <option value="">— None —</option>
                {album.images.map((img) => (
                  <option key={img.id} value={img.media.id}>
                    {img.caption || img.altText || img.media.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </Field>
          </FormSection>
        ) : null}

        <FormFooter
          cancelHref="/admin/albums"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>

      {album ? (
        <FormSection
          title="Photos"
          description="Upload, caption and reorder the photos in this album."
          single
        >
          <AlbumImagesPanel albumId={album.id} images={album.images} />
        </FormSection>
      ) : null}
    </FormPage>
  );
}
