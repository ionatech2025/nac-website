import Link from "next/link";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { isContentStatus } from "../../../lib/content-status";
import { StatusBadge } from "../_components/status-badge";
import adminStyles from "../admin.module.css";
import styles from "../cms.module.css";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function ProgrammesListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const statusFilter =
    params.status && isContentStatus(params.status) ? params.status : undefined;

  const programmes = await prisma.programme.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin">← Dashboard</Link>
          </p>
          <h1>Programmes</h1>
        </div>
        <Link href="/admin/programmes/new" className={styles.primaryLink}>
          New programme
        </Link>
      </div>

      <form className={styles.filters} method="get">
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Title or slug" />
        </label>
        <label>
          Status
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

      {programmes.length === 0 ? (
        <p className={styles.empty}>No programmes match.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Order</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/programmes/${p.id}`}>{p.title}</Link>
                  </td>
                  <td>{p.slug}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>{p.sortOrder}</td>
                  <td>{p.updatedAt.toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
