const TZ = "Africa/Kampala";

function ymd(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}

/** Compact inbox date: time if today, "12 Nov" this year, else "12 Nov 2025". */
export function formatInboxDate(d: Date, now = new Date()): string {
  if (ymd(d) === ymd(now)) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(d);
  }
  const sameYear = ymd(d).slice(0, 4) === ymd(now).slice(0, 4);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(d);
}

/** Full timestamp for the detail view, e.g. "Tue 17 Nov 2026, 14:05 EAT". */
export function formatInquiryTimestamp(d: Date): string {
  const text = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(d);
  return `${text} EAT`;
}

export function inquirySnippet(message: string, max = 110): string {
  const flat = message.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
