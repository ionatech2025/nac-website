import { notFound } from "next/navigation";
import { Archive, ArchiveRestore, MailOpen, Reply } from "lucide-react";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import {
  formatInquiryTimestamp,
  initialsOf,
} from "../../../../lib/inquiry-format";
import { ConfirmDelete } from "../../_components/confirm-delete";
import { AsideCard, FormPage } from "../../_components/form/form-page";
import layout from "../../_components/form/form-layout.module.css";
import {
  archiveInquiry,
  deleteInquiry,
  markInquiryUnread,
  unarchiveInquiry,
} from "../actions";
import styles from "../../_components/inbox/detail.module.css";

type Props = { params: Promise<{ id: string }> };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function replyHref(email: string, subject: string): string {
  const re = /^re:/i.test(subject) ? subject : `Re: ${subject}`;
  return `mailto:${email}?subject=${encodeURIComponent(re)}`;
}

export default async function InquiryDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const found = await prisma.inquiry.findUnique({ where: { id } });
  if (!found) notFound();

  const inquiry = found.isRead
    ? found
    : await prisma.inquiry.update({ where: { id }, data: { isRead: true } });
  const received = formatInquiryTimestamp(inquiry.createdAt);

  return (
    <FormPage
      backHref="/admin/inquiries"
      backLabel="Inquiries"
      title={inquiry.subject}
      description={`Received ${received}`}
      aside={
        <>
          <AsideCard title="Actions">
            <a href={replyHref(inquiry.email, inquiry.subject)} className={styles.reply}>
              <Reply size={15} aria-hidden />
              Reply by email
            </a>
            <div className={styles.stack}>
              {!inquiry.isArchived ? (
                <form action={markInquiryUnread.bind(null, inquiry.id)}>
                  <button type="submit" className={styles.btn}>
                    <MailOpen size={14} aria-hidden />
                    Mark as unread
                  </button>
                </form>
              ) : null}
              <form
                action={(inquiry.isArchived ? unarchiveInquiry : archiveInquiry).bind(
                  null,
                  inquiry.id,
                )}
              >
                <button type="submit" className={styles.btn}>
                  {inquiry.isArchived ? (
                    <ArchiveRestore size={14} aria-hidden />
                  ) : (
                    <Archive size={14} aria-hidden />
                  )}
                  {inquiry.isArchived ? "Move to inbox" : "Archive"}
                </button>
              </form>
            </div>
            <div className={layout.actions}>
              <ConfirmDelete
                action={deleteInquiry.bind(null, inquiry.id)}
                warning="The message will be removed for good."
              />
            </div>
          </AsideCard>
          <AsideCard title="Contact">
            <dl className={layout.meta}>
              <div>
                <dt>Name</dt>
                <dd title={inquiry.name}>{inquiry.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd title={inquiry.email}>{inquiry.email}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{inquiry.isArchived ? "Archived" : "In inbox"}</dd>
              </div>
            </dl>
          </AsideCard>
        </>
      }
    >
      <article className={styles.card}>
        <header className={styles.from}>
          <span className={styles.avatar} aria-hidden>
            {initialsOf(inquiry.name)}
          </span>
          <span className={styles.who}>
            <span className={styles.name}>{inquiry.name}</span>
            <a href={`mailto:${inquiry.email}`} className={styles.email}>
              {inquiry.email}
            </a>
          </span>
          {inquiry.isArchived ? (
            <span className={`${styles.badge} ${styles.badgeArchived}`}>Archived</span>
          ) : null}
          <time className={styles.when} dateTime={inquiry.createdAt.toISOString()}>
            {received}
          </time>
        </header>
        <pre className={styles.body}>{inquiry.message}</pre>
      </article>
    </FormPage>
  );
}
