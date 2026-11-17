import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageSquareWarning,
  NotebookPen,
  Timer,
} from "lucide-react";
import { complaintDaysLeft } from "../../../lib/complaint-retention";
import type { Complaint } from "@repo/database";
import {
  COMPLAINT_PAGE_SIZE,
  COMPLAINT_STATUS_LABEL,
  type ComplaintFilters,
  complaintListHref,
  formatComplaintDate,
  hasActiveComplaintFilters,
} from "../../../lib/complaint-filters";
import { inquirySnippet } from "../../../lib/inquiry-format";
import inbox from "../_components/inbox/inbox.module.css";
import styles from "./complaints.module.css";

export function ComplaintStatusPill({ status }: { status: Complaint["status"] }) {
  return (
    <span className={`${styles.status} ${styles[`status${status}`]}`}>
      {COMPLAINT_STATUS_LABEL[status]}
    </span>
  );
}

function RetentionHint({ submittedOn }: { submittedOn: Date }) {
  const days = complaintDaysLeft(submittedOn);
  if (days > 7) return null;
  return (
    <span className={styles.expiring} title="Deleted automatically under the retention policy">
      <Timer size={12} aria-hidden />
      {days <= 1 ? "Deletes tomorrow" : `Deletes in ${days}d`}
    </span>
  );
}

export function ComplaintList({ items }: { items: Complaint[] }) {
  return (
    <ul className={inbox.list}>
      {items.map((c) => (
        <li key={c.id}>
          <Link href={`/admin/complaints/${c.id}`} className={styles.row}>
            <ComplaintStatusPill status={c.status} />
            <span
              className={
                c.category ? styles.category : `${styles.category} ${styles.uncategorised}`
              }
            >
              {c.category ?? "Uncategorised"}
            </span>
            <span className={styles.summary}>
              <span className={styles.snippet}>{inquirySnippet(c.description, 120)}</span>
              {c.programmeOrPlace ? (
                <span className={styles.place}>
                  <MapPin size={12} aria-hidden />
                  {c.programmeOrPlace}
                </span>
              ) : null}
            </span>
            <span className={styles.meta}>
              {c.adminNotes ? (
                <NotebookPen size={14} className={styles.noteIcon} aria-label="Has notes" />
              ) : null}
              <RetentionHint submittedOn={c.submittedOn} />
              {formatComplaintDate(c.submittedOn)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ComplaintEmpty({ filters }: { filters: ComplaintFilters }) {
  const filtered = hasActiveComplaintFilters(filters);
  return (
    <div className={inbox.empty}>
      <span className={inbox.emptyIcon}>
        <MessageSquareWarning size={22} aria-hidden />
      </span>
      <p className={inbox.emptyTitle}>
        {filtered ? "No complaints match these filters" : "No complaints here"}
      </p>
      {filtered
        ? "Try a different search, category or date range."
        : "Anonymous complaints submitted on the website will appear here."}
    </div>
  );
}

export function ComplaintPager({
  filters,
  total,
}: {
  filters: ComplaintFilters;
  total: number;
}) {
  const pages = Math.max(1, Math.ceil(total / COMPLAINT_PAGE_SIZE));
  const start = (filters.page - 1) * COMPLAINT_PAGE_SIZE + 1;
  const end = Math.min(total, filters.page * COMPLAINT_PAGE_SIZE);
  const prev = filters.page > 1;
  const next = filters.page < pages;
  const btn = (enabled: boolean) =>
    enabled ? inbox.pagerBtn : `${inbox.pagerBtn} ${inbox.pagerDisabled}`;

  return (
    <div className={inbox.pager}>
      <span>
        {start}–{end} of {total}
      </span>
      <div className={inbox.pagerLinks}>
        <Link
          href={complaintListHref(filters, { page: filters.page - 1 })}
          className={btn(prev)}
          aria-disabled={!prev}
        >
          <ChevronLeft size={14} aria-hidden /> Newer
        </Link>
        <Link
          href={complaintListHref(filters, { page: filters.page + 1 })}
          className={btn(next)}
          aria-disabled={!next}
        >
          Older <ChevronRight size={14} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
