import Link from "next/link";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../lib/require-admin";
import { toKampalaDateTimeLocal } from "../../../lib/kampala-datetime";
import { EventStatusBadge } from "../_components/event-status-badge";
import adminStyles from "../admin.module.css";
import styles from "../cms.module.css";

const EVENT_STATUSES = ["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"] as const;

type EventStatusValue = (typeof EVENT_STATUSES)[number];

function isEventStatus(value: string): value is EventStatusValue {
  return (EVENT_STATUSES as readonly string[]).includes(value);
}

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function EventsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const statusFilter =
    params.status && isEventStatus(params.status) ? params.status : undefined;

  const events = await prisma.event.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { location: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { image: { select: { url: true } } },
    orderBy: [{ startAt: "desc" }],
  });

  return (
    <section className={adminStyles.panel}>
      <div className={styles.toolbar}>
        <div>
          <p className={adminStyles.eyebrow}>
            <Link href="/admin">← Dashboard</Link>
          </p>
          <h1>Events</h1>
        </div>
        <Link href="/admin/events/new" className={styles.primaryLink}>
          New event
        </Link>
      </div>

      <form className={styles.filters} method="get">
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Title, slug, location" />
        </label>
        <label>
          Status
          <select name="status" defaultValue={statusFilter ?? ""}>
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <button type="submit" className={styles.ghostButton}>
          Filter
        </button>
      </form>

      {events.length === 0 ? (
        <p className={styles.empty}>No events match.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Starts (Kampala)</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.image.url}
                        alt=""
                        className={styles.photoPreview}
                        style={{ width: "2.75rem", height: "2.75rem" }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/events/${e.id}`}>{e.title}</Link>
                  </td>
                  <td>{toKampalaDateTimeLocal(e.startAt).replace("T", " ")}</td>
                  <td>
                    <EventStatusBadge status={e.status} />
                  </td>
                  <td>{e.updatedAt.toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
