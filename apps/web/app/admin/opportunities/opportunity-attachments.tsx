import { FileText } from "lucide-react";
import { FormSection } from "../_components/form/form-fields";
import { removeAttachment } from "./actions";
import styles from "./opportunity-attachments.module.css";

type AttachmentRow = {
  id: string;
  title: string | null;
  media: { url: string; fileName: string; byteSize: number };
};

export function OpportunityAttachments({
  opportunityId,
  attachments,
}: {
  opportunityId: string;
  attachments: AttachmentRow[];
}) {
  if (attachments.length === 0) return null;

  return (
    <FormSection
      title="Attachments"
      description="PDFs currently attached to this listing."
      single
    >
      <ul className={styles.list}>
        {attachments.map((a) => (
          <li key={a.id} className={styles.row}>
            <FileText size={16} aria-hidden className={styles.icon} />
            <a
              href={a.media.url}
              target="_blank"
              rel="noreferrer"
              className={styles.name}
            >
              {a.title || a.media.fileName}
            </a>
            <span className={styles.size}>
              {Math.round(a.media.byteSize / 1024)} KB
            </span>
            <form action={removeAttachment.bind(null, a.id, opportunityId)}>
              <button type="submit" className={styles.remove}>
                Remove
              </button>
            </form>
          </li>
        ))}
      </ul>
    </FormSection>
  );
}
