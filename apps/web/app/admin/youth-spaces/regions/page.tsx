import Link from "next/link";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import adminStyles from "../../admin.module.css";
import styles from "../../cms.module.css";
import { ConfirmDelete } from "../../_components/confirm-delete";
import { createRegion, deleteRegion, updateRegion } from "../region-actions";
import own from "../youth-spaces.module.css";

type SearchParams = Promise<{ done?: string; error?: string }>;

const DONE: Record<string, string> = {
  created: "Region added.",
  saved: "Region saved.",
  deleted: "Region deleted.",
};

const ERRORS: Record<string, string> = {
  validation: "A region needs a name (up to 80 characters).",
  duplicate: "A region with that name already exists.",
  "not-empty": "That region still has spaces. Move them to another region first.",
};

export default async function YouthRegionsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const { done, error } = await searchParams;
  const regions = await prisma.youthRegion.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { spaces: true } } },
  });
  const nextOrder = (regions.at(-1)?.sortOrder ?? -1) + 1;

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin/youth-spaces">← Youth spaces</Link>
          </p>
          <h1>Regions</h1>
        </div>
      </div>

      {done && DONE[done] ? <p className={own.flash}>{DONE[done]}</p> : null}
      {error && ERRORS[error] ? <p className={own.flashError}>{ERRORS[error]}</p> : null}

      <div className={styles.filters}>
        <form action={createRegion} className={own.regionForm}>
          <input name="name" required maxLength={80} placeholder="New region, e.g. Northern Uganda" aria-label="Region name" />
          <input name="sortOrder" type="number" min={0} defaultValue={nextOrder} aria-label="Order" />
          <button type="submit" className={`${styles.button} ${own.small}`}>
            Add region
          </button>
        </form>
      </div>

      {regions.length === 0 ? (
        <p className={styles.empty}>No regions yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name and order</th>
                <th>Spaces</th>
                <th aria-label="Delete" />
              </tr>
            </thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.id}>
                  <td>
                    <form action={updateRegion.bind(null, r.id)} className={own.regionForm}>
                      <input name="name" required maxLength={80} defaultValue={r.name} aria-label="Region name" />
                      <input name="sortOrder" type="number" min={0} defaultValue={r.sortOrder} aria-label="Order" />
                      <button type="submit" className={`${styles.ghostButton} ${own.small}`}>
                        Save
                      </button>
                    </form>
                  </td>
                  <td>
                    <Link href={`/admin/youth-spaces?region=${r.id}`}>{r._count.spaces}</Link>
                  </td>
                  <td>
                    {r._count.spaces === 0 ? (
                      <ConfirmDelete action={deleteRegion.bind(null, r.id)} label="Delete" />
                    ) : (
                      <span className={own.sub}>Has spaces</span>
                    )}
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
