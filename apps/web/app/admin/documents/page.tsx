import Link from "next/link";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { isContentStatus } from "../../../lib/content-status";
import { StatusBadge } from "../_components/status-badge";
import adminStyles from "../admin.module.css";
import styles from "../cms.module.css";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function DocumentsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const statusFilter =
    params.status && isContentStatus(params.status) ? params.status : undefined;

  const documents = await prisma.document.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { category: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      media: { select: { url: true, fileName: true } },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin">← Dashboard</Link>
          </p>
          <h1>Downloads</h1>
        </div>
        <Link href="/admin/documents/new" className={styles.primaryLink}>
          New download
        </Link>
      </div>

      <form className={styles.filters} method="get">
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Title or category" />
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

      {documents.length === 0 ? (
        <p className={styles.empty}>No downloads match.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Size</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link href={`/admin/documents/${d.id}`}>{d.title}</Link>
                  </td>
                  <td>{d.category?.name ?? "—"}</td>
                  <td>{Math.round(d.byteSize / 1024)} KB</td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>{d.updatedAt.toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
