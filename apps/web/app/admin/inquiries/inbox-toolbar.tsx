import Link from "next/link";
import { Search } from "lucide-react";
import {
  type InquiryFilters,
  type InquiryView,
  hasActiveInquiryFilters,
  inquiryListHref,
} from "../../../lib/inquiry-filters";
import styles from "../_components/inbox/toolbar.module.css";

const TAB_LABELS: Record<InquiryView, string> = {
  inbox: "Inbox",
  unread: "Unread",
  read: "Read",
  archived: "Archived",
};

export function InboxTabs({
  filters,
  counts,
}: {
  filters: InquiryFilters;
  counts: Record<InquiryView, number>;
}) {
  return (
    <nav className={styles.tabs} aria-label="Inquiry views">
      {(Object.keys(TAB_LABELS) as InquiryView[]).map((view) => {
        const active = filters.view === view;
        return (
          <Link
            key={view}
            href={inquiryListHref(filters, { view, page: 1 })}
            className={active ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            aria-current={active ? "page" : undefined}
          >
            {TAB_LABELS[view]}
            <span className={styles.count}>{counts[view]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function InboxFilters({ filters }: { filters: InquiryFilters }) {
  return (
    <form method="get" className={styles.filters} role="search">
      {filters.view !== "inbox" ? (
        <input type="hidden" name="view" value={filters.view} />
      ) : null}
      <label className={`${styles.field} ${styles.search}`}>
        Search
        <Search size={15} className={styles.searchIcon} aria-hidden />
        <input
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Name, email, subject or message"
        />
      </label>
      <label className={styles.field}>
        From
        <input name="from" type="date" defaultValue={filters.from} />
      </label>
      <label className={styles.field}>
        To
        <input name="to" type="date" defaultValue={filters.to} />
      </label>
      <button type="submit" className={styles.apply}>
        Apply
      </button>
      {hasActiveInquiryFilters(filters) ? (
        <Link
          href={inquiryListHref(filters, { q: "", from: "", to: "", page: 1 })}
          className={styles.clear}
        >
          Clear
        </Link>
      ) : null}
    </form>
  );
}
