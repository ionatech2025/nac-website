import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import type { AttentionSnapshot } from "../../../../lib/admin-attention";
import layout from "./dashboard.module.css";
import styles from "./coming-up.module.css";

type Item = {
  id: string;
  title: string;
  date: Date;
  kind: "Closes" | "Event";
  href: string;
};

function toItems(data: AttentionSnapshot): Item[] {
  const items: Item[] = [
    ...data.closingOpportunities.map((o) => ({
      id: o.id,
      title: o.title,
      date: o.closingDate,
      kind: "Closes" as const,
      href: `/admin/opportunities/${o.id}`,
    })),
    ...data.upcomingEvents.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.startAt,
      kind: "Event" as const,
      href: `/admin/events/${e.id}`,
    })),
  ];
  return items.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 6);
}

export function ComingUp({ data }: { data: AttentionSnapshot }) {
  const items = toItems(data);

  return (
    <section className={layout.card} aria-labelledby="coming-up-title">
      <header className={layout.cardHeader}>
        <div>
          <h2 id="coming-up-title" className={layout.cardTitle}>
            Coming up
          </h2>
          <p className={layout.cardSub}>Closing opportunities & events</p>
        </div>
      </header>
      <div className={layout.cardBody}>
        {items.length === 0 ? (
          <div className={layout.empty}>
            <span className={layout.emptyIcon}>
              <CalendarCheck size={18} aria-hidden />
            </span>
            Nothing due in the next few weeks.
          </div>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <Link href={item.href} className={styles.row}>
                  <span className={styles.date}>
                    <span className={styles.month}>
                      {item.date.toLocaleDateString("en-GB", { month: "short" })}
                    </span>
                    <span className={styles.day}>{item.date.getDate()}</span>
                  </span>
                  <span className={styles.text}>
                    <span className={styles.title}>{item.title}</span>
                    <span
                      className={
                        item.kind === "Closes" ? styles.tagOrange : styles.tagBlue
                      }
                    >
                      {item.kind === "Closes" ? "Opportunity closes" : "Event"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
