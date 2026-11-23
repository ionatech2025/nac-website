import type { Metadata } from "next";
import { EventsCalendar } from "@/components/events/events-calendar";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import {
  listAllPublicEvents,
  listUpcomingEvents,
} from "@/lib/events-data";
import styles from "./events.module.css";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse NAC events in month, week, day and year views, and see what is coming next.",
};

type Props = {
  searchParams: Promise<{ view?: string; date?: string }>;
};

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const [upcoming, all] = await Promise.all([
    listUpcomingEvents(),
    listAllPublicEvents(),
  ]);

  return (
    <section className={styles.page} aria-labelledby="events-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="events-heading" className={styles.title}>
        Events
      </h1>
      <p className={styles.lead}>
        Calendar views for upcoming activity across the network. Times are shown
        in Africa/Kampala unless noted otherwise.
      </p>
      <EventsCalendar
        events={all}
        initialView={params.view}
        initialDate={params.date}
      />
      <UpcomingEvents events={upcoming} />
    </section>
  );
}
