import Link from "next/link";
import { EmptyState } from "@/components/content-states";
import { formatEventWhen, type PublicEvent } from "@/lib/events-data";
import styles from "./past-events-list.module.css";

type Props = {
  events: PublicEvent[];
  page: number;
  pageCount: number;
};

function hrefFor(page: number): string {
  return page <= 1 ? "/events/archive" : `/events/archive?page=${page}`;
}

export function PastEventsList({ events, page, pageCount }: Props) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No past events yet"
        message="Past events will appear in this archive once they have ended."
      />
    );
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.id} className={styles.item}>
            <p className={styles.when}>
              <time dateTime={event.startAt}>{formatEventWhen(event)}</time>
            </p>
            <h2 className={styles.title}>
              <Link href={`/events/${event.slug}`}>{event.title}</Link>
            </h2>
            {event.location ? (
              <p className={styles.location}>{event.location}</p>
            ) : null}
          </li>
        ))}
      </ul>
      {pageCount > 1 ? (
        <nav className={styles.pager} aria-label="Past events pages">
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} rel="prev">
              Previous
            </Link>
          ) : (
            <span className={styles.disabled}>Previous</span>
          )}
          <p>
            Page {page} of {pageCount}
          </p>
          {page < pageCount ? (
            <Link href={hrefFor(page + 1)} rel="next">
              Next
            </Link>
          ) : (
            <span className={styles.disabled}>Next</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
