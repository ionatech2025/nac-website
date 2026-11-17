import Link from "next/link";
import styles from "./form-fields.module.css";

export const formClass = styles.form;

export function FormSection({
  title,
  description,
  single = false,
  children,
}: {
  title: string;
  description?: string;
  single?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description ? (
          <p className={styles.sectionDesc}>{description}</p>
        ) : null}
      </header>
      <div
        className={single ? `${styles.sectionBody} ${styles.single}` : styles.sectionBody}
      >
        {children}
      </div>
    </section>
  );
}

export function Field({
  label,
  hint,
  optional = false,
  full = false,
  group = false,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  full?: boolean;
  group?: boolean;
  children: React.ReactNode;
}) {
  const className = full ? `${styles.field} ${styles.full}` : styles.field;
  const body = (
    <>
      <span className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}>Optional</span> : null}
      </span>
      {children}
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </>
  );
  return group ? (
    <div className={className}>{body}</div>
  ) : (
    <label className={className}>{body}</label>
  );
}

export function CheckField({
  label,
  full = true,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={full ? `${styles.check} ${styles.full}` : styles.check}>
      {children}
      {label}
    </label>
  );
}

export function FormFooter({
  cancelHref,
  submitLabel,
  note = "Changes are not live until published.",
}: {
  cancelHref: string;
  submitLabel: string;
  note?: string;
}) {
  return (
    <div className={styles.footer}>
      <span className={styles.footerNote}>{note}</span>
      <div className={styles.footerActions}>
        <Link href={cancelHref} className={styles.btnGhost}>
          Cancel
        </Link>
        <button type="submit" className={styles.btnPrimary}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
