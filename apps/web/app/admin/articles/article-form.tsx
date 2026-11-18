import type { Article } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
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
  archiveArticle,
  createArticle,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from "./actions";

type ArticleWithImages = Article & {
  coverImage: { url: string; altText: string | null } | null;
  ogImage: { url: string; altText: string | null } | null;
};

type Props = {
  article?: ArticleWithImages;
  error?: string;
  saved?: boolean;
};

const IMAGE_TYPES = "image/jpeg,image/png,image/webp";

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") {
    return "Check the required fields and try again.";
  }
  if (error.startsWith("cover-")) {
    return `Cover: ${imageUploadErrorMessage(error.replace("cover-", "") as ImageUploadError)}`;
  }
  if (error.startsWith("og-")) {
    return `Sharing image: ${imageUploadErrorMessage(error.replace("og-", "") as ImageUploadError)}`;
  }
  return "Something went wrong. Try again.";
}

export function ArticleForm({ article, error, saved }: Props) {
  const isEdit = Boolean(article);
  const action = isEdit
    ? updateArticle.bind(null, article!.id)
    : createArticle;
  const hint = `JPEG, PNG or WebP · up to ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB`;

  return (
    <FormPage
      backHref="/admin/articles"
      backLabel="Articles"
      title={isEdit ? "Edit article" : "New article"}
      description="News and stories shown on the public News page."
      status={article?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={article?.updatedAt}>
            {article ? (
              <CmsStatusActions
                status={article.status}
                publish={publishArticle.bind(null, article.id)}
                unpublish={unpublishArticle.bind(null, article.id)}
                archive={archiveArticle.bind(null, article.id)}
              />
            ) : null}
          </StatusCard>
          {article ? (
            <PreviewPanel
              title={article.title}
              lines={[
                { label: "Slug", value: article.slug },
                { label: "Author", value: article.author ?? "" },
                { label: "Cover", value: article.coverImage ? "Uploaded" : "None" },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Content" description="The headline, summary and full story.">
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="A clear, descriptive headline"
              defaultValue={article?.title ?? ""}
            />
          </Field>
          <Field label="Slug" optional hint="Generated from the title if left empty.">
            <input
              name="slug"
              placeholder="my-article-title"
              defaultValue={article?.slug ?? ""}
            />
          </Field>
          <Field label="Author" optional>
            <input
              name="author"
              placeholder="e.g. NAC Communications"
              defaultValue={article?.author ?? ""}
            />
          </Field>
          <Field label="Excerpt" optional full hint="Shown on cards and in search results.">
            <textarea
              name="excerpt"
              placeholder="One or two sentences summarising the article"
              defaultValue={article?.excerpt ?? ""}
              style={{ minHeight: 80 }}
            />
          </Field>
          <Field label="Body" full hint={RICH_TEXT_HINT}>
            <textarea
              name="body"
              required
              placeholder="Write the full article…"
              defaultValue={article?.body ?? ""}
              style={{ minHeight: 280 }}
            />
          </Field>
        </FormSection>

        <FormSection title="Cover image" single>
          <Field label="Cover image" group>
            <FileDrop
              name="coverImage"
              accept={IMAGE_TYPES}
              required={!isEdit}
              currentUrl={article?.coverImage?.url}
              hint={hint}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Search & sharing"
          description="Optional overrides for search engines and social previews."
        >
          <Field label="SEO title" optional full>
            <input
              name="seoTitle"
              placeholder="Defaults to the article title"
              defaultValue={article?.seoTitle ?? ""}
            />
          </Field>
          <Field label="SEO description" optional full>
            <textarea
              name="seoDescription"
              placeholder="Defaults to the excerpt"
              defaultValue={article?.seoDescription ?? ""}
              style={{ minHeight: 72 }}
            />
          </Field>
          <Field label="Sharing image" optional full group>
            <FileDrop
              name="ogImage"
              accept={IMAGE_TYPES}
              currentUrl={article?.ogImage?.url}
              hint={`${hint} · 1200×630 recommended`}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/articles"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
