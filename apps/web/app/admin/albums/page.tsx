import Link from "next/link";
import { mediaVariantUrl, prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { isContentStatus } from "../../../lib/content-status";
import { StatusBadge } from "../_components/status-badge";
import adminStyles from "../admin.module.css";
import styles from "../cms.module.css";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function AlbumsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const statusFilter =
    params.status && isContentStatus(params.status) ? params.status : undefined;

  const albums = await prisma.photoAlbum.findMany({
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
    include: {
      coverMedia: { select: { url: true, thumbUrl: true } },
      _count: { select: { images: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin">← Dashboard</Link>
          </p>
          <h1>Photo albums</h1>
        </div>
        <Link href="/admin/albums/new" className={styles.primaryLink}>
          New album
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

      {albums.length === 0 ? (
        <p className={styles.empty}>No albums match.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Images</th>
                <th>Status</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.coverMedia?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaVariantUrl(a.coverMedia, "thumb")}
                        alt=""
                        className={styles.photoPreview}
                        style={{ width: "2.75rem", height: "2.75rem" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/albums/${a.id}`}>{a.title}</Link>
                  </td>
                  <td>{a._count.images}</td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>{a.sortOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
