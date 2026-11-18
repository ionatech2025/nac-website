import Link from "next/link";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { isContentStatus } from "../../../lib/content-status";
import { StatusBadge } from "../_components/status-badge";
import adminStyles from "../admin.module.css";
import styles from "../cms.module.css";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function VideosListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const statusFilter =
    params.status && isContentStatus(params.status) ? params.status : undefined;

  const videos = await prisma.videoLink.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { url: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { thumbnailMedia: { select: { url: true } } },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin">← Dashboard</Link>
          </p>
          <h1>Videos</h1>
        </div>
        <Link href="/admin/videos/new" className={styles.primaryLink}>
          New video
        </Link>
      </div>

      <form className={styles.filters} method="get">
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Title or URL" />
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

      {videos.length === 0 ? (
        <p className={styles.empty}>No videos match.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Thumb</th>
                <th>Title</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id}>
                  <td>
                    {v.thumbnailMedia?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.thumbnailMedia.url}
                        alt=""
                        className={styles.photoPreview}
                        style={{ width: "2.75rem", height: "2.75rem" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/videos/${v.id}`}>{v.title}</Link>
                  </td>
                  <td>{v.provider}</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                  <td>{v.sortOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
