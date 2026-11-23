import type { Metadata } from "next";
import Link from "next/link";
import { PastEventsList } from "@/components/events/past-events-list";
import { listPastEventsPage } from "@/lib/events-data";
import styles from "../events.module.css";

export const metadata: Metadata = {
  title: "Past events",
  description: "Archive of past Network for Active Citizens events.",
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PastEventsArchivePage({ searchParams }: Props) {
  const { page } = await searchParams;
  const result = await listPastEventsPage({ page: Number(page) || 1 });

  return (
    <section className={styles.page} aria-labelledby="archive-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="archive-heading" className={styles.title}>
        Past events
      </h1>
      <p className={styles.lead}>
        Events that have already ended remain browsable here, separate from
        upcoming activity.
      </p>
      <p className={styles.back}>
        <Link href="/events">← Back to events calendar</Link>
      </p>
      <PastEventsList
        events={result.items}
        page={result.page}
        pageCount={result.pageCount}
      />
    </section>
  );
}
