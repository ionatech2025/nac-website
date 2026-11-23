import Link from "next/link";
import {
  formatEventWhen,
  type PublicEvent,
} from "@/lib/events-data";
import styles from "./upcoming-events.module.css";

type Props = {
  events: PublicEvent[];
  title?: string;
};

export function UpcomingEvents({
  events,
  title = "Upcoming events",
}: Props) {
  return (
    <section className={styles.section} aria-labelledby="upcoming-events-heading">
      <div className={styles.header}>
        <h2 id="upcoming-events-heading" className={styles.title}>
          {title}
        </h2>
        <Link className={styles.archive} href="/events/archive">
          Past events archive
        </Link>
      </div>
      {events.length === 0 ? (
        <p className={styles.empty}>No upcoming events right now.</p>
      ) : (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.id} className={styles.item}>
              <div className={styles.meta}>
                {event.cancelled ? (
                  <span className={styles.cancelled}>Cancelled</span>
                ) : null}
                <time dateTime={event.startAt}>{formatEventWhen(event)}</time>
              </div>
              <h3 className={styles.eventTitle}>
                <Link href={`/events/${event.slug}`}>{event.title}</Link>
              </h3>
              {event.location ? (
                <p className={styles.location}>{event.location}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
