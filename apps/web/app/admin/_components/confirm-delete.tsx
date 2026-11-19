"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import styles from "./confirm-delete.module.css";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  warning?: string;
};

/** Two-step delete: the first click reveals an explicit confirmation. */
export function ConfirmDelete({
  action,
  label = "Delete",
  warning = "This can't be undone.",
}: Props) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setConfirming(true)}
      >
        <Trash2 size={14} aria-hidden />
        {label}
      </button>
    );
  }

  return (
    <div className={styles.panel} role="alertdialog" aria-label="Confirm delete">
      <p className={styles.text}>
        <strong>Delete permanently?</strong> {warning}
      </p>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => setConfirming(false)}
          autoFocus
        >
          Cancel
        </button>
        <form action={action}>
          <button type="submit" className={styles.confirm}>
            Yes, delete
          </button>
        </form>
      </div>
    </div>
  );
}
