import { ensureAboutPage, prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
import {
  imageUploadErrorMessage,
  type ImageUploadError,
} from "../../../lib/save-image-upload";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage } from "../_components/form/form-page";
import { PreviewPanel } from "../_components/preview-panel";
import { AboutPhotosPanel } from "./about-photos";
import { saveAboutPage } from "./actions";
import { MAX_ABOUT_PHOTOS } from "./limits";

type Props = { searchParams: Promise<{ error?: string; saved?: string }> };

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Title, mission, vision and what we do are required.";
  }
  if (error === "images-missing") return "Choose at least one photo to upload.";
  if (error === "photos-max") {
    return `About Us can have at most ${MAX_ABOUT_PHOTOS} photos. Remove one first.`;
  }
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(error.replace("image-", "") as ImageUploadError);
  }
  return "Something went wrong. Try again.";
}

export default async function AboutAdminPage({ searchParams }: Props) {
  await requireAdmin();
  const query = await searchParams;
  await ensureAboutPage();
  const page = await prisma.aboutPage.findUniqueOrThrow({
    where: { id: "about" },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: {
          id: true,
          caption: true,
          media: { select: { id: true, url: true, thumbUrl: true, altText: true } },
        },
      },
    },
  });

  return (
    <FormPage
      backHref="/admin"
      backLabel="Dashboard"
      title="About Us"
      description="Mission, vision and story shown on the public About page."
      error={errorCopy(query.error)}
      saved={query.saved === "1"}
      aside={
        <PreviewPanel
          title={page.title}
          lines={[
            {
              label: "Last updated",
              value: page.updatedAt.toLocaleString("en-GB"),
            },
            { label: "Photos", value: `${page.images.length} / ${MAX_ABOUT_PHOTOS}` },
          ]}
        />
      }
    >
      <form action={saveAboutPage} className={formClass}>
        <FormSection title="Page heading" description="Shown at the top of About Us.">
          <Field label="Title" full>
            <input name="title" required placeholder="About us" defaultValue={page.title} />
          </Field>
        </FormSection>

        <FormSection
          title="Sections"
          description="Each block appears with its own heading on the public page."
          single
        >
          <Field label="Mission" full hint={RICH_TEXT_HINT}>
            <textarea
              name="mission"
              required
              placeholder="Our mission…"
              defaultValue={page.mission}
              style={{ minHeight: 120 }}
            />
          </Field>
          <Field label="Vision" full hint={RICH_TEXT_HINT}>
            <textarea
              name="vision"
              required
              placeholder="Our vision…"
              defaultValue={page.vision}
              style={{ minHeight: 120 }}
            />
          </Field>
          <Field label="What we do" full hint={RICH_TEXT_HINT}>
            <textarea
              name="whatWeDo"
              required
              placeholder="What NAC does…"
              defaultValue={page.whatWeDo}
              style={{ minHeight: 160 }}
            />
          </Field>
          <Field label="Why" optional full hint={RICH_TEXT_HINT}>
            <textarea
              name="why"
              placeholder="Why this work matters…"
              defaultValue={page.why}
              style={{ minHeight: 120 }}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin"
          submitLabel="Save changes"
          note="Changes go live as soon as you save."
        />
      </form>

      <FormSection
        title="Photos"
        description={`Up to ${MAX_ABOUT_PHOTOS} photos for the About page.`}
        single
      >
        <AboutPhotosPanel images={page.images} />
      </FormSection>
    </FormPage>
  );
}
