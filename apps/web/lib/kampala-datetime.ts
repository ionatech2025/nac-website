/** Africa/Kampala is UTC+3 year-round (no DST). */

const KAMPALA_OFFSET = "+03:00";

/** Parse `datetime-local` value as Kampala wall time → UTC Date. */
export function parseKampalaDateTimeLocal(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null;
  }
  const d = new Date(`${value}:00${KAMPALA_OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Format UTC Date for `datetime-local` input in Kampala. */
export function toKampalaDateTimeLocal(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(d);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export const DEFAULT_EVENT_TIMEZONE = "Africa/Kampala";
