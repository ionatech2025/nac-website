import Link from "next/link";
import {
  deriveOpportunityStatus,
  labelDerivedOpportunityStatus,
  prisma,
} from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { isContentStatus } from "../../../lib/content-status";
import { StatusBadge } from "../_components/status-badge";
import adminStyles from "../admin.module.css";
import styles from "../cms.module.css";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function OpportunitiesListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const statusFilter =
    params.status && isContentStatus(params.status) ? params.status : undefined;

  const rows = await prisma.opportunity.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { contactEmail: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { type: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin">← Dashboard</Link>
          </p>
          <h1>Opportunities</h1>
          <p className={adminStyles.muted}>
            Listing Open/Closed is derived (Africa/Kampala end-of-day) — §8.
          </p>
        </div>
        <Link href="/admin/opportunities/new" className={styles.primaryLink}>
          New opportunity
        </Link>
      </div>

      <form className={styles.filters} method="get">
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Title or email" />
        </label>
        <label>
          Record status
          <select name="status" defaultValue={statusFilter ?? ""}>
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <button type="submit" className={styles.ghostButton}>
          Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <p className={styles.empty}>No opportunities match.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Record</th>
                <th>Listing</th>
                <th>Closes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link href={`/admin/opportunities/${row.id}`}>
                      {row.title}
                    </Link>
                  </td>
                  <td>{row.type?.name ?? "—"}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td>
                    {labelDerivedOpportunityStatus(deriveOpportunityStatus(row))}
                  </td>
                  <td>
                    {row.closingDate
                      ? row.closingDate.toISOString().slice(0, 10)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
