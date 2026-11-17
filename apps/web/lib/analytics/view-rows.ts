import { prisma } from "@repo/database";
import { utcYmd } from "./rollup";

/** One grouped slice of traffic: a roll-up row, or a single raw event (views 1). */
export type ViewRow = {
  day: string;
  path: string;
  referrerHost: string | null;
  country: string | null;
  city: string | null;
  deviceClass: string | null;
  browser: string | null;
  os: string | null;
  views: number;
};

export type ViewData = {
  rows: ViewRow[];
  /** Distinct visitors per UTC day (hash rotates daily, so days can't be merged). */
  visitorsByDay: Map<string, number>;
};

const DIMENSIONS = {
  path: true,
  referrerHost: true,
  country: true,
  city: true,
  deviceClass: true,
  browser: true,
  os: true,
} as const;

/**
 * Dashboard source (AD-B8-02): AnalyticsDaily for rolled-up days, raw
 * AnalyticsEvent only for days not rolled up yet (normally just today).
 */
export async function loadViewData(sinceYmd: string): Promise<ViewData> {
  const since = new Date(`${sinceYmd}T00:00:00Z`);
  const [totals, daily] = await Promise.all([
    prisma.analyticsDayTotal.findMany({
      where: { date: { gte: since } },
      select: { date: true, uniqueVisitors: true },
    }),
    prisma.analyticsDaily.findMany({
      where: { date: { gte: since } },
      select: { date: true, views: true, ...DIMENSIONS },
    }),
  ]);

  const visitorsByDay = new Map<string, number>();
  const rolled = new Set<string>();
  for (const t of totals) {
    const day = utcYmd(t.date);
    rolled.add(day);
    visitorsByDay.set(day, t.uniqueVisitors);
  }

  const latestRolled = [...rolled].sort().at(-1);
  const liveFrom = latestRolled
    ? new Date(Date.parse(`${latestRolled}T00:00:00Z`) + 86_400_000)
    : since;
  const events = await prisma.analyticsEvent.findMany({
    where: { occurredAt: { gte: liveFrom > since ? liveFrom : since } },
    select: { occurredAt: true, visitorHash: true, ...DIMENSIONS },
  });

  const rows: ViewRow[] = daily.map(({ date, ...rest }) => ({
    day: utcYmd(date),
    ...rest,
  }));

  const liveVisitors = new Map<string, Set<string>>();
  for (const { occurredAt, visitorHash, ...rest } of events) {
    const day = utcYmd(occurredAt);
    if (rolled.has(day)) continue;
    rows.push({ day, views: 1, ...rest });
    const set = liveVisitors.get(day) ?? new Set<string>();
    set.add(visitorHash);
    liveVisitors.set(day, set);
  }
  for (const [day, set] of liveVisitors) visitorsByDay.set(day, set.size);

  return { rows, visitorsByDay };
}
