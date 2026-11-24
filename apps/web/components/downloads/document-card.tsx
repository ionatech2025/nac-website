import { formatBytes } from "@/lib/format-bytes";
import {
  formatDocumentDate,
  type PublicDocument,
} from "@/lib/downloads-data";
import styles from "./document-card.module.css";

type Props = {
  document: PublicDocument;
};

export function DocumentCard({ document }: Props) {
  const size = formatBytes(document.byteSize);
  const dateLabel = formatDocumentDate(document.publishedAt);

  return (
    <li className={styles.item}>
      <div className={styles.copy}>
        <h2 className={styles.title}>
          <a href={document.downloadPath}>{document.title}</a>
        </h2>
        {document.description ? (
          <p className={styles.description}>{document.description}</p>
        ) : null}
        <dl className={styles.meta}>
          {document.category ? (
            <div>
              <dt>Category</dt>
              <dd>{document.category.name}</dd>
            </div>
          ) : null}
          {dateLabel ? (
            <div>
              <dt>Published</dt>
              <dd>
                <time dateTime={document.publishedAt ?? undefined}>{dateLabel}</time>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>File</dt>
            <dd>
              {document.fileType}
              {size ? ` · ${size}` : ""}
            </dd>
          </div>
        </dl>
      </div>
      <a className={styles.download} href={document.downloadPath}>
        Download
      </a>
    </li>
  );
}
