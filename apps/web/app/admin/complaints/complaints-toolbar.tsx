import Link from "next/link";
import { Search } from "lucide-react";
import {
  type ComplaintFilters,
  type ComplaintView,
  complaintListHref,
  hasActiveComplaintFilters,
} from "../../../lib/complaint-filters";
import toolbar from "../_components/inbox/toolbar.module.css";
import styles from "./complaints.module.css";

const TAB_LABELS: Record<ComplaintView, string> = {
  new: "New",
  reviewed: "Reviewed",
  closed: "Closed",
  all: "All",
};

export function ComplaintTabs({
  filters,
  counts,
}: {
  filters: ComplaintFilters;
  counts: Record<ComplaintView, number>;
}) {
  return (
    <nav className={toolbar.tabs} aria-label="Complaint status">
      {(Object.keys(TAB_LABELS) as ComplaintView[]).map((view) => {
        const active = filters.view === view;
        return (
          <Link
            key={view}
            href={complaintListHref(filters, { view, page: 1 })}
            className={active ? `${toolbar.tab} ${toolbar.tabActive}` : toolbar.tab}
            aria-current={active ? "page" : undefined}
          >
            {TAB_LABELS[view]}
            <span className={toolbar.count}>{counts[view]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function ComplaintFiltersBar({
  filters,
  categories,
}: {
  filters: ComplaintFilters;
  categories: string[];
}) {
  return (
    <form method="get" className={toolbar.filters} role="search">
      {filters.view !== "new" ? (
        <input type="hidden" name="view" value={filters.view} />
      ) : null}
      <label className={`${toolbar.field} ${toolbar.search}`}>
        Search
        <Search size={15} className={toolbar.searchIcon} aria-hidden />
        <input
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Description, programme or place"
        />
      </label>
      <label className={toolbar.field}>
        Category
        <select name="category" defaultValue={filters.category} className={styles.select}>
          <option value="">All categories</option>
          <option value="__none">Uncategorised</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className={toolbar.field}>
        Submitted from
        <input name="from" type="date" defaultValue={filters.from} />
      </label>
      <label className={toolbar.field}>
        To
        <input name="to" type="date" defaultValue={filters.to} />
      </label>
      <button type="submit" className={toolbar.apply}>
        Apply
      </button>
      {hasActiveComplaintFilters(filters) ? (
        <Link
          href={complaintListHref(filters, {
            q: "",
            category: "",
            from: "",
            to: "",
            page: 1,
          })}
          className={toolbar.clear}
        >
          Clear
        </Link>
      ) : null}
    </form>
  );
}
