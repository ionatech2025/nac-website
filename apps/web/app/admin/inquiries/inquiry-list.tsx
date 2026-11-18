import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import type { Inquiry } from "@repo/database";
import {
  INQUIRY_PAGE_SIZE,
  type InquiryFilters,
  hasActiveInquiryFilters,
  inquiryListHref,
} from "../../../lib/inquiry-filters";
import {
  formatInboxDate,
  initialsOf,
  inquirySnippet,
} from "../../../lib/inquiry-format";
import styles from "../_components/inbox/inbox.module.css";

export function InquiryList({ items }: { items: Inquiry[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={`/admin/inquiries/${item.id}`}
            className={item.isRead ? styles.row : `${styles.row} ${styles.unread}`}
          >
            <span
              className={item.isRead ? `${styles.dot} ${styles.dotRead}` : styles.dot}
              aria-label={item.isRead ? undefined : "Unread"}
            />
            <span className={styles.avatar} aria-hidden>
              {initialsOf(item.name)}
            </span>
            <span className={styles.sender}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.email}>{item.email}</span>
            </span>
            <span className={styles.subjectLine}>
              <span className={styles.subject}>{item.subject}</span>
              {" — "}
              {inquirySnippet(item.message)}
            </span>
            <time className={styles.date} dateTime={item.createdAt.toISOString()}>
              {formatInboxDate(item.createdAt)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function InquiryEmpty({ filters }: { filters: InquiryFilters }) {
  const filtered = hasActiveInquiryFilters(filters);
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <Inbox size={22} aria-hidden />
      </span>
      <p className={styles.emptyTitle}>
        {filtered ? "No inquiries match these filters" : "Nothing here"}
      </p>
      {filtered
        ? "Try a different search term or date range."
        : filters.view === "archived"
          ? "Archived inquiries will appear here."
          : "New messages from the contact form will appear here."}
    </div>
  );
}

export function InquiryPager({
  filters,
  total,
}: {
  filters: InquiryFilters;
  total: number;
}) {
  const pages = Math.max(1, Math.ceil(total / INQUIRY_PAGE_SIZE));
  const start = (filters.page - 1) * INQUIRY_PAGE_SIZE + 1;
  const end = Math.min(total, filters.page * INQUIRY_PAGE_SIZE);
  const prev = filters.page > 1;
  const next = filters.page < pages;

  return (
    <div className={styles.pager}>
      <span>
        {start}–{end} of {total}
      </span>
      <div className={styles.pagerLinks}>
        <Link
          href={inquiryListHref(filters, { page: filters.page - 1 })}
          className={prev ? styles.pagerBtn : `${styles.pagerBtn} ${styles.pagerDisabled}`}
          aria-disabled={!prev}
        >
          <ChevronLeft size={14} aria-hidden /> Newer
        </Link>
        <Link
          href={inquiryListHref(filters, { page: filters.page + 1 })}
          className={next ? styles.pagerBtn : `${styles.pagerBtn} ${styles.pagerDisabled}`}
          aria-disabled={!next}
        >
          Older <ChevronRight size={14} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
