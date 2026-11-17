import type { YouthRegion, YouthSpace } from "@repo/database";
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
  archiveYouthSpace,
  createYouthSpace,
  publishYouthSpace,
  unpublishYouthSpace,
  updateYouthSpace,
} from "./actions";
import { MAX_SPACE_PHOTOS } from "./limits";
import { SpacePhotosPanel, type SpacePhoto } from "./space-photos";

type Props = {
  space?: YouthSpace & { images: SpacePhoto[] };
  regions: YouthRegion[];
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Check the required fields. The map link must start with http:// or https://.";
  }
  if (error === "slug") return "Another space already uses that slug. Choose a different one.";
  if (error === "images-missing") return "Choose at least one photo to upload.";
  if (error === "photos-max") return `A space can have at most ${MAX_SPACE_PHOTOS} photos. Remove one first.`;
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(error.replace("image-", "") as ImageUploadError);
  }
  return "Something went wrong. Try again.";
}

export function SpaceForm({ space, regions, error, saved }: Props) {
  const action = space ? updateYouthSpace.bind(null, space.id) : createYouthSpace;
  const regionName = regions.find((r) => r.id === space?.regionId)?.name ?? "";

  return (
    <FormPage
      backHref="/admin/youth-spaces"
      backLabel="Youth spaces"
      title={space ? "Edit youth space" : "New youth space"}
      description="Physical youth spaces listed by region on the public Youth Spaces page."
      status={space?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={space?.updatedAt}>
            {space ? (
              <CmsStatusActions
                status={space.status}
                publish={publishYouthSpace.bind(null, space.id)}
                unpublish={unpublishYouthSpace.bind(null, space.id)}
                archive={archiveYouthSpace.bind(null, space.id)}
              />
            ) : null}
          </StatusCard>
          {space ? (
            <PreviewPanel
              title={space.name}
              lines={[
                { label: "Region", value: regionName },
                { label: "Public URL", value: `/youth-spaces/${space.slug}` },
                { label: "Services", value: String(space.services.length) },
                { label: "Photos", value: `${space.images.length} / ${MAX_SPACE_PHOTOS}` },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="The space name, where it is and who runs it.">
          <Field label="Name" full>
            <input name="name" required placeholder="e.g. Kisaasi Youth Space" defaultValue={space?.name ?? ""} />
          </Field>
          <Field label="Region">
            <select name="regionId" required defaultValue={space?.regionId ?? ""}>
              <option value="" disabled>
                Choose a region
              </option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location / area" optional>
            <input name="location" placeholder="e.g. Kisaasi, Kampala" defaultValue={space?.location ?? ""} />
          </Field>
          <Field label="Managing partner" optional full hint="The organisation that runs or coordinates the space.">
            <input
              name="managingPartner"
              placeholder="e.g. HADE (Holistic Action for Development and Empowerment)"
              defaultValue={space?.managingPartner ?? ""}
            />
          </Field>
          <Field label="Slug" optional hint="Used in the public link. Generated from the name if empty.">
            <input name="slug" placeholder="kisaasi-youth-space" defaultValue={space?.slug ?? ""} />
          </Field>
          <Field label="Sort order" hint="Order within the region. Lower first.">
            <input name="sortOrder" type="number" min={0} defaultValue={space?.sortOrder ?? 0} />
          </Field>
        </FormSection>

        <FormSection title="What the space offers" description="Shown on the space card and page.">
          <Field label="Description" full hint={RICH_TEXT_HINT}>
            <textarea
              name="description"
              required
              placeholder="A short description of the space and who it serves"
              defaultValue={space?.description ?? ""}
              style={{ minHeight: 120 }}
            />
          </Field>
          <Field label="Services & activities" optional full hint="One per line. Up to 20.">
            <textarea
              name="services"
              placeholder={"Free Wi-Fi\nCommunity library\nSkills training"}
              defaultValue={space?.services.join("\n") ?? ""}
              style={{ minHeight: 140 }}
            />
          </Field>
          <Field label="Map link" optional full hint="Paste a Google Maps or OpenStreetMap link.">
            <input name="mapUrl" type="url" placeholder="https://maps.app.goo.gl/…" defaultValue={space?.mapUrl ?? ""} />
          </Field>
        </FormSection>

        <FormFooter cancelHref="/admin/youth-spaces" submitLabel={space ? "Save changes" : "Create draft"} />
      </form>

      {space ? (
        <FormSection
          title="Photos"
          description={`Up to ${MAX_SPACE_PHOTOS} photos. The first one is used on the space card.`}
          single
        >
          <SpacePhotosPanel spaceId={space.id} images={space.images} />
        </FormSection>
      ) : null}
    </FormPage>
  );
}
