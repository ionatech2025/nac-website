import { CircleCheck, ShieldCheck } from "lucide-react";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import {
  COMPLAINT_RETENTION_DAYS,
  purgeExpiredComplaints,
} from "../../../lib/complaint-retention";
import {
  COMPLAINT_PAGE_SIZE,
  type ComplaintSearchParams,
  complaintWhere,
  parseComplaintFilters,
} from "../../../lib/complaint-filters";
import inbox from "../_components/inbox/inbox.module.css";
import toolbar from "../_components/inbox/toolbar.module.css";
import { ComplaintEmpty, ComplaintList, ComplaintPager } from "./complaint-list";
import { ComplaintFiltersBar, ComplaintTabs } from "./complaints-toolbar";
import styles from "./complaints.module.css";

type Props = {
  searchParams: Promise<ComplaintSearchParams & { done?: string }>;
};

export default async function ComplaintsPage({ searchParams }: Props) {
  await requireAdmin();
  await purgeExpiredComplaints();
  const sp = await searchParams;
  const filters = parseComplaintFilters(sp);
  const where = complaintWhere(filters);

  const [items, total, grouped, categoryRows] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: [{ submittedOn: "desc" }, { status: "asc" }],
      skip: (filters.page - 1) * COMPLAINT_PAGE_SIZE,
      take: COMPLAINT_PAGE_SIZE,
    }),
    prisma.complaint.count({ where }),
    prisma.complaint.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.complaint.findMany({
      where: { category: { not: null } },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  const byStatus = (s: string) =>
    grouped.find((g) => g.status === s)?._count._all ?? 0;
  const counts = {
    new: byStatus("NEW"),
    reviewed: byStatus("REVIEWED"),
    closed: byStatus("CLOSED"),
    all: grouped.reduce((sum, g) => sum + g._count._all, 0),
  };
  const categories = categoryRows
    .map((r) => r.category)
    .filter((c): c is string => Boolean(c));

  return (
    <div className={inbox.page}>
      <header className={inbox.header}>
        <div>
          <h1 className={inbox.title}>Complaints</h1>
          <p className={inbox.description}>
            Anonymous complaints from the public website.
            {counts.new > 0 ? ` ${counts.new} awaiting review.` : " Nothing awaiting review."}
          </p>
        </div>
      </header>

      <div className={styles.privacy}>
        <ShieldCheck size={16} aria-hidden />
        <span>
          Complainants are anonymous. No name, contact details, IP address, device,
          location or exact time is stored — only what they chose to write and the
          date it was submitted. Complaints are deleted automatically{" "}
          {COMPLAINT_RETENTION_DAYS} days after submission.
        </span>
      </div>

      {sp.done === "deleted" ? (
        <div className={toolbar.flash} role="status">
          <CircleCheck size={16} aria-hidden />
          Complaint deleted permanently.
        </div>
      ) : null}

      <ComplaintTabs filters={filters} counts={counts} />

      <section className={inbox.card} aria-label="Complaints">
        <ComplaintFiltersBar filters={filters} categories={categories} />
        {items.length === 0 ? (
          <ComplaintEmpty filters={filters} />
        ) : (
          <>
            <ComplaintList items={items} />
            <ComplaintPager filters={filters} total={total} />
          </>
        )}
      </section>
    </div>
  );
}
