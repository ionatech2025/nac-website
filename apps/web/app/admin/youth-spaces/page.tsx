import Link from "next/link";
import { prisma, type Prisma } from "@repo/database";
import { isContentStatus } from "../../../lib/content-status";
import { requireAdmin } from "../../../lib/require-admin";
import { StatusBadge } from "../_components/status-badge";
import adminStyles from "../admin.module.css";
import styles from "../cms.module.css";
import { loadStarterSpaces } from "./actions";
import own from "./youth-spaces.module.css";

type SearchParams = Promise<{ q?: string; region?: string; status?: string; done?: string }>;

function flashCopy(done?: string): string | null {
  if (!done?.startsWith("starter-")) return null;
  const n = Number(done.slice("starter-".length));
  return n > 0
    ? `Loaded ${n} starter spaces as drafts. Review each one, then publish.`
    : "Starter spaces were already loaded — nothing new to add.";
}

export default async function YouthSpacesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const status = params.status && isContentStatus(params.status) ? params.status : undefined;

  const regions = await prisma.youthRegion.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });
  const regionId = regions.some((r) => r.id === params.region) ? params.region : undefined;

  const where: Prisma.YouthSpaceWhereInput = {
    ...(status ? { status } : {}),
    ...(regionId ? { regionId } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
            { managingPartner: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [spaces, total] = await Promise.all([
    prisma.youthSpace.findMany({
      where,
      orderBy: [{ region: { sortOrder: "asc" } }, { sortOrder: "asc" }, { name: "asc" }],
      include: { region: { select: { name: true } }, _count: { select: { images: true } } },
    }),
    prisma.youthSpace.count(),
  ]);
  const flash = flashCopy(params.done);

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin">← Dashboard</Link>
          </p>
          <h1>Youth spaces</h1>
        </div>
        <div className={own.actions}>
          <Link href="/admin/youth-spaces/regions" className={styles.ghostButton}>
            Regions ({regions.length})
          </Link>
          <Link href="/admin/youth-spaces/new" className={styles.primaryLink}>
            New space
          </Link>
        </div>
      </div>

      {flash ? <p className={own.flash}>{flash}</p> : null}

      {total === 0 ? (
        <div className={own.starter}>
          <h2>No youth spaces yet</h2>
          <p>
            Load the regions and spaces from the improvements document (Appendix A) to start from
            NAC&apos;s list. They arrive as drafts so names and details can be checked before anything
            goes public. Kunya is loaded once.
          </p>
          <form action={loadStarterSpaces}>
            <button type="submit" className={styles.button}>
              Load starter spaces
            </button>
          </form>
        </div>
      ) : (
        <>
          <form className={styles.filters} method="get">
            <label>
              Search
              <input name="q" defaultValue={q} placeholder="Name, location or partner" />
            </label>
            <label>
              Region
              <select name="region" defaultValue={regionId ?? ""}>
                <option value="">All regions</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue={status ?? ""}>
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

          {spaces.length === 0 ? (
            <p className={styles.empty}>No youth spaces match.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Space</th>
                    <th>Region</th>
                    <th>Managing partner</th>
                    <th>Photos</th>
                    <th>Status</th>
                    <th>Order</th>
                  </tr>
                </thead>
                <tbody>
                  {spaces.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <Link href={`/admin/youth-spaces/${s.id}`}>{s.name}</Link>
                        {s.location ? <span className={own.sub}>{s.location}</span> : null}
                      </td>
                      <td>{s.region.name}</td>
                      <td>{s.managingPartner ?? <span className={own.muted}>—</span>}</td>
                      <td>{s._count.images}</td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                      <td>{s.sortOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
