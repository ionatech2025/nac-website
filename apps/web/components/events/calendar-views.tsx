import Link from "next/link";
import { monthGrid, toDateKey } from "@/lib/events-calendar";
import type { PublicEvent } from "@/lib/events-data";
import styles from "./events-calendar.module.css";

type DayMap = Map<string, PublicEvent[]>;

export function MonthView({
  focus,
  byDay,
}: {
  focus: Date;
  byDay: DayMap;
}) {
  const days = monthGrid(focus);
  const month = focus.getMonth();

  return (
    <div className={styles.month} role="grid" aria-label="Month view">
      <div className={styles.weekdays} role="row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className={styles.weekday} role="columnheader">
            {day}
          </div>
        ))}
      </div>
      <div className={styles.monthGrid}>
        {days.map((day) => {
          const key = toDateKey(day);
          const items = byDay.get(key) ?? [];
          const outside = day.getMonth() !== month;
          return (
            <div
              key={key}
              className={outside ? styles.dayOutside : styles.day}
              role="gridcell"
            >
              <span className={styles.dayNum}>{day.getDate()}</span>
              <ul className={styles.dayEvents}>
                {items.slice(0, 3).map((event) => (
                  <li key={event.id}>
                    <Link href={`/events/${event.slug}`}>
                      {event.cancelled ? "Cancelled: " : ""}
                      {event.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RangeView({ days, byDay }: { days: Date[]; byDay: DayMap }) {
  return (
    <ul className={styles.range}>
      {days.map((day) => {
        const key = toDateKey(day);
        const items = byDay.get(key) ?? [];
        const heading = new Intl.DateTimeFormat("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }).format(day);
        return (
          <li key={key} className={styles.rangeDay}>
            <h3 className={styles.rangeHeading}>{heading}</h3>
            {items.length === 0 ? (
              <p className={styles.muted}>No events</p>
            ) : (
              <ul className={styles.rangeEvents}>
                {items.map((event) => (
                  <li key={event.id}>
                    <Link href={`/events/${event.slug}`}>
                      {event.cancelled ? (
                        <span className={styles.cancelled}>Cancelled</span>
                      ) : null}
                      {event.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function YearView({
  year,
  byDay,
  onSelectMonth,
}: {
  year: number;
  byDay: DayMap;
  onSelectMonth: (date: Date) => void;
}) {
  return (
    <ul className={styles.year}>
      {Array.from({ length: 12 }, (_, month) => {
        const label = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(
          new Date(year, month, 1),
        );
        let count = 0;
        for (const [key, items] of byDay) {
          if (key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)) {
            count += items.length;
          }
        }
        return (
          <li key={month}>
            <button
              type="button"
              className={styles.yearMonth}
              onClick={() => onSelectMonth(new Date(year, month, 1, 12))}
            >
              <span>{label}</span>
              <span className={styles.muted}>
                {count} event{count === 1 ? "" : "s"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
