import { CheckCheck, CircleCheck } from "lucide-react";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import {
  INQUIRY_PAGE_SIZE,
  type InquirySearchParams,
  inquiryWhere,
  parseInquiryFilters,
} from "../../../lib/inquiry-filters";
import { markAllInquiriesRead } from "./actions";
import { InboxFilters, InboxTabs } from "./inbox-toolbar";
import { InquiryEmpty, InquiryList, InquiryPager } from "./inquiry-list";
import styles from "../_components/inbox/inbox.module.css";
import toolbar from "../_components/inbox/toolbar.module.css";

const DONE_COPY: Record<string, string> = {
  archived: "Inquiry archived.",
  deleted: "Inquiry deleted permanently.",
  unread: "Marked as unread.",
};

type Props = {
  searchParams: Promise<InquirySearchParams & { done?: string }>;
};

export default async function InquiriesPage({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const filters = parseInquiryFilters(sp);
  const where = inquiryWhere(filters);

  const [items, total, inbox, unread, read, archived] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * INQUIRY_PAGE_SIZE,
      take: INQUIRY_PAGE_SIZE,
    }),
    prisma.inquiry.count({ where }),
    prisma.inquiry.count({ where: { isArchived: false } }),
    prisma.inquiry.count({ where: { isArchived: false, isRead: false } }),
    prisma.inquiry.count({ where: { isArchived: false, isRead: true } }),
    prisma.inquiry.count({ where: { isArchived: true } }),
  ]);
  const done = sp.done ? DONE_COPY[sp.done] : undefined;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inquiries</h1>
          <p className={styles.description}>
            Messages sent through the public contact form.
            {unread > 0 ? ` ${unread} unread.` : " You're all caught up."}
          </p>
        </div>
        {unread > 0 ? (
          <form action={markAllInquiriesRead}>
            <button type="submit" className={toolbar.markAll}>
              <CheckCheck size={15} aria-hidden />
              Mark all as read
            </button>
          </form>
        ) : null}
      </header>

      {done ? (
        <div className={toolbar.flash} role="status">
          <CircleCheck size={16} aria-hidden />
          {done}
        </div>
      ) : null}

      <InboxTabs
        filters={filters}
        counts={{ inbox, unread, read, archived }}
      />

      <section className={styles.card} aria-label="Inquiries">
        <InboxFilters filters={filters} />
        {items.length === 0 ? (
          <InquiryEmpty filters={filters} />
        ) : (
          <>
            <InquiryList items={items} />
            <InquiryPager filters={filters} total={total} />
          </>
        )}
      </section>
    </div>
  );
}
