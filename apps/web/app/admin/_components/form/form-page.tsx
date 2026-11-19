import Link from "next/link";
import { ArrowLeft, CircleAlert, CircleCheck } from "lucide-react";
import { StatusBadge } from "../status-badge";
import styles from "./form-layout.module.css";

type Props = {
  backHref: string;
  backLabel: string;
  title: string;
  description?: string;
  status?: string;
  error?: string | null;
  saved?: boolean;
  aside?: React.ReactNode;
  children: React.ReactNode;
};

export function FormPage({
  backHref,
  backLabel,
  title,
  description,
  status,
  error,
  saved,
  aside,
  children,
}: Props) {
  return (
    <div className={styles.page}>
      <Link href={backHref} className={styles.back}>
        <ArrowLeft size={14} aria-hidden />
        {backLabel}
      </Link>
      <header className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>
            {status ? <StatusBadge status={status} /> : null}
          </div>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </div>
      </header>

      {error ? (
        <div className={`${styles.alert} ${styles.alertError}`} role="alert">
          <CircleAlert size={16} aria-hidden />
          {error}
        </div>
      ) : null}
      {saved ? (
        <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
          <CircleCheck size={16} aria-hidden />
          Changes saved.
        </div>
      ) : null}

      <div className={styles.layout}>
        <div className={styles.main}>{children}</div>
        {aside ? <aside className={styles.aside}>{aside}</aside> : null}
      </div>
    </div>
  );
}

export function AsideCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardHead}>{title}</h2>
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
}

export function StatusCard({
  updatedAt,
  children,
}: {
  updatedAt?: Date;
  children?: React.ReactNode;
}) {
  return (
    <AsideCard title="Publishing">
      {updatedAt ? (
        <dl className={styles.meta}>
          <div>
            <dt>Last updated</dt>
            <dd>
              {updatedAt.toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Africa/Kampala",
              })}
            </dd>
          </div>
        </dl>
      ) : (
        <p className={styles.note}>
          New items are saved as a <strong>draft</strong>. Publish once
          everything looks right.
        </p>
      )}
      {children}
    </AsideCard>
  );
}
