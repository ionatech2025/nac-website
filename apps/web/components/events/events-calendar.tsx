"use client";

import { useMemo, useState } from "react";
import {
  eventDateKey,
  formatFocusLabel,
  parseFocusDate,
  parseView,
  shiftFocus,
  toDateKey,
  weekDays,
  type CalendarView,
} from "@/lib/events-calendar";
import type { PublicEvent } from "@/lib/events-data";
import { MonthView, RangeView, YearView } from "./calendar-views";
import styles from "./events-calendar.module.css";

type Props = {
  events: PublicEvent[];
  initialView?: string;
  initialDate?: string;
};

const VIEWS: { id: CalendarView; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
  { id: "year", label: "Year" },
];

export function EventsCalendar({ events, initialView, initialDate }: Props) {
  const [view, setView] = useState<CalendarView>(parseView(initialView));
  const [focus, setFocus] = useState(() => parseFocusDate(initialDate));

  const byDay = useMemo(() => {
    const map = new Map<string, PublicEvent[]>();
    for (const event of events) {
      const key = eventDateKey(event.startAt, event.timezone);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const label = formatFocusLabel(view, focus);
  const focusKey = toDateKey(focus);

  function go(direction: -1 | 1) {
    setFocus((current) => shiftFocus(view, current, direction));
  }

  return (
    <section className={styles.calendar} aria-label="Events calendar">
      <div className={styles.toolbar}>
        <div className={styles.views} role="tablist" aria-label="Calendar view">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={view === item.id}
              className={view === item.id ? styles.viewActive : styles.view}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className={styles.nav}>
          <button type="button" className={styles.navBtn} onClick={() => go(-1)}>
            Previous
          </button>
          <p className={styles.focusLabel} aria-live="polite">
            {label}
          </p>
          <button type="button" className={styles.navBtn} onClick={() => go(1)}>
            Next
          </button>
        </div>
      </div>

      {view === "month" ? <MonthView focus={focus} byDay={byDay} /> : null}
      {view === "week" ? <RangeView days={weekDays(focus)} byDay={byDay} /> : null}
      {view === "day" ? <RangeView days={[focus]} byDay={byDay} /> : null}
      {view === "year" ? (
        <YearView
          year={focus.getFullYear()}
          byDay={byDay}
          onSelectMonth={(date) => {
            setFocus(date);
            setView("month");
          }}
        />
      ) : null}

      <p className={styles.hint}>Focus day: {focusKey}</p>
    </section>
  );
}
