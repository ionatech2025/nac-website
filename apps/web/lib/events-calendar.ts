/** Calendar date helpers for Epic E9 views (local calendar math). */

export type CalendarView = "month" | "week" | "day" | "year";

export function parseView(value?: string): CalendarView {
  if (value === "week" || value === "day" || value === "year") return value;
  return "month";
}

/** Parse YYYY-MM-DD into a local Date at noon (stable across DST edges). */
export function parseFocusDate(value?: string, fallback = new Date()): Date {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parts = value.split("-").map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (y === undefined || m === undefined || d === undefined) {
      return parseFocusDate(undefined, fallback);
    }
    return new Date(y, m - 1, d, 12, 0, 0, 0);
  }
  return new Date(
    fallback.getFullYear(),
    fallback.getMonth(),
    fallback.getDate(),
    12,
    0,
    0,
    0,
  );
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  // Sunday = 0 (local calendar week for Events).
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(12, 0, 0, 0);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function shiftFocus(view: CalendarView, focus: Date, direction: -1 | 1): Date {
  if (view === "month") return addMonths(focus, direction);
  if (view === "week") return addDays(focus, direction * 7);
  if (view === "day") return addDays(focus, direction);
  return addYears(focus, direction);
}

export function monthGrid(focus: Date): Date[] {
  const first = new Date(focus.getFullYear(), focus.getMonth(), 1, 12);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function weekDays(focus: Date): Date[] {
  const start = startOfWeek(focus);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function eventDateKey(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function formatFocusLabel(view: CalendarView, focus: Date): string {
  if (view === "year") {
    return String(focus.getFullYear());
  }
  if (view === "month") {
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(focus);
  }
  if (view === "week") {
    const days = weekDays(focus);
    const start = days[0] ?? focus;
    const end = days[6] ?? focus;
    return `${start.getDate()}–${end.getDate()} ${new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
    }).format(end)}`;
  }
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(focus);
}
