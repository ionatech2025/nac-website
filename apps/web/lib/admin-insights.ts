import { prisma } from "@repo/database";
import { classifyReferrerHost } from "./analytics/referrer-class";
import { utcYmd } from "./analytics/rollup";
import { loadViewData, type ViewRow } from "./analytics/view-rows";

const DAY_MS = 86_400_000;
const PERIOD_DAYS = 30;
const CHART_DAYS = 14;
const TOP_N = 10;

export type CountRow = { label: string; count: number };

export type ContentTypeSummary = {
  type: string;
  draft: number;
  published: number;
  archived: number;
};

export type DailyPoint = { day: string; label: string; views: number };

export type InsightsSnapshot = {
  periodDays: typeof PERIOD_DAYS;
  totalViews: number;
  /** Sum of daily distinct visitor hashes (hash rotates daily). */
  visitors: number;
  daily: DailyPoint[];
  topPages: CountRow[];
  trafficSources: CountRow[];
  countries: CountRow[];
  cities: CountRow[];
  devices: CountRow[];
  browsers: CountRow[];
  operatingSystems: CountRow[];
  contentSummary: ContentTypeSummary[];
};

function tally(
  rows: ViewRow[],
  key: (row: ViewRow) => string | null,
  unknownLabel = "Unknown",
): CountRow[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const label = key(row)?.trim() || unknownLabel;
    map.set(label, (map.get(label) ?? 0) + row.views);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, TOP_N);
}

async function contentStatusCounts(
  type: string,
  countFn: (status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => Promise<number>,
): Promise<ContentTypeSummary> {
  const [draft, published, archived] = await Promise.all([
    countFn("DRAFT"),
    countFn("PUBLISHED"),
    countFn("ARCHIVED"),
  ]);
  return { type, draft, published, archived };
}

/**
 * AD-B2-03 insights for the last 30 UTC days (today included) + CMS content
 * summary. Traffic comes from daily roll-ups, see ./analytics/view-rows.
 */
export async function getInsightsSnapshot(): Promise<InsightsSnapshot> {
  const sinceYmd = utcYmd(new Date(Date.now() - (PERIOD_DAYS - 1) * DAY_MS));

  const [{ rows, visitorsByDay }, contentSummary] = await Promise.all([
    loadViewData(sinceYmd),
    Promise.all([
      contentStatusCounts("Team members", (status) =>
        prisma.teamMember.count({ where: { status } }),
      ),
      contentStatusCounts("Programmes", (status) =>
        prisma.programme.count({ where: { status } }),
      ),
      contentStatusCounts("Youth spaces", (status) =>
        prisma.youthSpace.count({ where: { status } }),
      ),
      contentStatusCounts("Articles", (status) =>
        prisma.article.count({ where: { status } }),
      ),
      contentStatusCounts("Opportunities", (status) =>
        prisma.opportunity.count({ where: { status } }),
      ),
      contentStatusCounts("Events", async (status) => {
        if (status === "DRAFT") {
          return prisma.event.count({ where: { status: "DRAFT" } });
        }
        if (status === "PUBLISHED") {
          return prisma.event.count({ where: { status: "PUBLISHED" } });
        }
        return prisma.event.count({
          where: { status: { in: ["ARCHIVED", "CANCELLED"] } },
        });
      }),
      contentStatusCounts("Documents", (status) =>
        prisma.document.count({ where: { status } }),
      ),
      contentStatusCounts("Partners", (status) =>
        prisma.partner.count({ where: { status } }),
      ),
    ]),
  ]);

  const sourceMap = new Map<string, number>();
  const dayViews = new Map<string, number>();
  let totalViews = 0;
  for (const row of rows) {
    totalViews += row.views;
    dayViews.set(row.day, (dayViews.get(row.day) ?? 0) + row.views);
    const cls = classifyReferrerHost(row.referrerHost);
    sourceMap.set(cls, (sourceMap.get(cls) ?? 0) + row.views);
  }
  let visitors = 0;
  for (const count of visitorsByDay.values()) visitors += count;

  const trafficSources = (["direct", "search", "social", "other"] as const).map(
    (label) => ({ label, count: sourceMap.get(label) ?? 0 }),
  );

  const daily: DailyPoint[] = [];
  for (let i = CHART_DAYS - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * DAY_MS);
    const day = utcYmd(d);
    daily.push({
      day,
      label: d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
      views: dayViews.get(day) ?? 0,
    });
  }

  return {
    periodDays: PERIOD_DAYS,
    totalViews,
    visitors,
    daily,
    topPages: tally(rows, (r) => r.path),
    trafficSources,
    countries: tally(rows, (r) => r.country),
    cities: tally(rows, (r) => r.city),
    devices: tally(rows, (r) => r.deviceClass),
    browsers: tally(rows, (r) => r.browser),
    operatingSystems: tally(rows, (r) => r.os),
    contentSummary,
  };
}
