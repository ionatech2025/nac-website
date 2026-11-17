"use client";

import { useEffect, useState } from "react";
import { FileText, ImageUp } from "lucide-react";
import styles from "./file-drop.module.css";

type Props = {
  name: string;
  accept: string;
  kind?: "image" | "pdf";
  required?: boolean;
  multiple?: boolean;
  currentUrl?: string | null;
  hint?: string;
};

export function FileDrop({
  name,
  accept,
  kind = "image",
  required = false,
  multiple = false,
  currentUrl,
  hint,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const first = files[0];
    if (kind !== "image" || !first) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(first);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [files, kind]);

  const thumb = preview ?? (kind === "image" ? currentUrl : null);
  const Icon = kind === "image" ? ImageUp : FileText;

  return (
    <div className={styles.zone}>
      <input
        className={styles.input}
        type="file"
        name={name}
        accept={accept}
        required={required}
        multiple={multiple}
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className={styles.thumb} />
      ) : (
        <span className={styles.icon}>
          <Icon size={20} aria-hidden />
        </span>
      )}
      <span className={styles.text}>
        {files.length > 0 ? (
          <span className={styles.fileName}>
            {files.length === 1 ? files[0]!.name : `${files.length} files selected`}
          </span>
        ) : (
          <span className={styles.primary}>
            <em>Click to upload</em> or drag and drop
          </span>
        )}
        <span className={styles.secondary}>
          {files.length > 0
            ? "Click to choose a different file"
            : currentUrl
              ? `Current file kept unless replaced${hint ? ` · ${hint}` : ""}`
              : hint}
        </span>
      </span>
    </div>
  );
}
