import {
  documentDownloadPath,
  type Document,
  type DocumentCategory,
} from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import {
  pdfUploadErrorMessage,
  type PdfUploadError,
} from "../../../lib/save-pdf-upload";
import { CmsStatusActions } from "../_components/cms-status-actions";
import { FileDrop } from "../_components/form/file-drop";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { AsideCard, FormPage, StatusCard } from "../_components/form/form-page";
import { PreviewPanel } from "../_components/preview-panel";
import {
  archiveDocument,
  createDocument,
  publishDocument,
  unpublishDocument,
  updateDocument,
} from "./actions";
import styles from "./document-form.module.css";

type DocWithRelations = Document & {
  category: DocumentCategory | null;
  media: { url: string; fileName: string } | null;
};

type Props = {
  document?: DocWithRelations;
  categories: DocumentCategory[];
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") return "Check the required fields and try again.";
  if (error.startsWith("pdf-")) {
    return pdfUploadErrorMessage(error.replace("pdf-", "") as PdfUploadError);
  }
  return "Something went wrong. Try again.";
}

export function DocumentForm({
  document: doc,
  categories,
  error,
  saved,
}: Props) {
  const isEdit = Boolean(doc);
  const action = isEdit
    ? updateDocument.bind(null, doc!.id)
    : createDocument;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <FormPage
      backHref="/admin/documents"
      backLabel="Downloads"
      title={isEdit ? "Edit download" : "New download"}
      description="PDF files listed on the public Downloads page."
      status={doc?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={doc?.updatedAt}>
            {doc ? (
              <CmsStatusActions
                status={doc.status}
                publish={publishDocument.bind(null, doc.id)}
                unpublish={unpublishDocument.bind(null, doc.id)}
                archive={archiveDocument.bind(null, doc.id)}
              />
            ) : null}
          </StatusCard>
          {doc ? (
            <AsideCard title="Public link">
              <code className={styles.stableLink}>
                {documentDownloadPath(doc.id)}
              </code>
              <p className={styles.linkNote}>
                {doc.status === "PUBLISHED"
                  ? "Share this link — it keeps working when you upload a new PDF."
                  : "Works once the download is published."}{" "}
                Downloads so far: {doc.downloadCount}.
              </p>
            </AsideCard>
          ) : null}
          {doc ? (
            <PreviewPanel
              title={doc.title}
              lines={[
                { label: "Category", value: doc.category?.name ?? "" },
                { label: "File", value: doc.media?.fileName ?? "" },
                { label: "Size", value: `${Math.round(doc.byteSize / 1024)} KB` },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="Title and a short description of the file.">
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="e.g. Annual Report 2025"
              defaultValue={doc?.title ?? ""}
            />
          </Field>
          <Field label="Description" optional full>
            <textarea
              name="description"
              placeholder="What this document covers"
              defaultValue={doc?.description ?? ""}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Category"
          description="Pick an existing category or create a new one."
        >
          <Field label="Category" optional>
            <select name="categoryId" defaultValue={doc?.categoryId ?? ""}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Or create category" optional>
            <input name="newCategoryName" placeholder="New category name" />
          </Field>
        </FormSection>

        <FormSection title="File" single>
          <Field label="PDF file" optional={isEdit} group>
            <FileDrop
              name="file"
              accept="application/pdf,.pdf"
              kind="pdf"
              required={!isEdit}
              currentUrl={doc?.media?.url}
              hint={`PDF only · up to ${maxMb} MB`}
            />
          </Field>
          {doc?.media?.url ? (
            <a
              href={doc.media.url}
              target="_blank"
              rel="noreferrer"
              className={styles.fileLink}
            >
              Open current file: {doc.media.fileName} (
              {Math.round(doc.byteSize / 1024)} KB)
            </a>
          ) : null}
        </FormSection>

        <FormFooter
          cancelHref="/admin/documents"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
