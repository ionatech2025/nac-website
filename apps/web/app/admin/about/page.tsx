import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage } from "../_components/form/form-page";
import { PreviewPanel } from "../_components/preview-panel";
import { ABOUT_PAGE_KEY } from "../../../lib/about-content";
import { saveAboutPage } from "./actions";

type Props = { searchParams: Promise<{ error?: string; saved?: string }> };

export default async function AboutAdminPage({ searchParams }: Props) {
  await requireAdmin();
  const query = await searchParams;
  const page = await prisma.pageContent.findUnique({
    where: { key: ABOUT_PAGE_KEY },
  });

  return (
    <FormPage
      backHref="/admin"
      backLabel="Dashboard"
      title="About Us"
      description="The introduction shown at the top of the public About page."
      error={query.error ? "Title and body are required." : null}
      saved={query.saved === "1"}
      aside={
        <PreviewPanel
          title={page?.title ?? "About us"}
          lines={[
            { label: "Content key", value: ABOUT_PAGE_KEY },
            {
              label: "Last updated",
              value: page ? page.updatedAt.toLocaleString("en-GB") : "Not created yet",
            },
            { label: "Body length", value: `${(page?.body ?? "").length} characters` },
          ]}
        />
      }
    >
      <form action={saveAboutPage} className={formClass}>
        <FormSection
          title="Page content"
          description="The heading and main text of the About page."
          single
        >
          <Field label="Title">
            <input
              name="title"
              required
              placeholder="About us"
              defaultValue={page?.title ?? "About us"}
            />
          </Field>
          <Field label="Body" hint={RICH_TEXT_HINT}>
            <textarea
              name="body"
              required
              placeholder="Who we are, what we do and why it matters…"
              defaultValue={page?.body ?? ""}
              style={{ minHeight: 320 }}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin"
          submitLabel="Save changes"
          note="Changes go live as soon as you save."
        />
      </form>
    </FormPage>
  );
}
