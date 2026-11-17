import { prisma } from "@repo/database";

/**
 * Daily analytics roll-up + raw cleanup (AD-B8-02 / B8-05, B8-07).
 *
 * Days are UTC because the visitor hash rotates at UTC midnight — a UTC day is
 * the only window in which "distinct visitorHash" means "distinct visitor".
 * Dates go to SQL as 'YYYY-MM-DD' strings so the DB session time zone can't
 * shift day boundaries.
 */
export const RAW_RETENTION_DAYS = 7;
const MAX_CATCH_UP_DAYS = 60;
const DAY_MS = 86_400_000;

export function utcYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(ymd: string, days: number): string {
  return utcYmd(new Date(Date.parse(`${ymd}T00:00:00Z`) + days * DAY_MS));
}

/** Rebuilds one completed day. Only safe while that day's raw rows still exist. */
async function rollUpDay(ymd: string): Promise<void> {
  await prisma.$transaction([
    prisma.$executeRaw`DELETE FROM "AnalyticsDaily" WHERE "date" = ${ymd}::date`,
    prisma.$executeRaw`
      INSERT INTO "AnalyticsDaily"
        ("id", "date", "path", "referrerHost", "country", "city",
         "deviceClass", "browser", "os", "views", "uniqueVisitors")
      SELECT gen_random_uuid(), ${ymd}::date, "path", "referrerHost", "country",
             "city", "deviceClass", "browser", "os",
             COUNT(*)::int, COUNT(DISTINCT "visitorHash")::int
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= ${ymd}::timestamp
        AND "occurredAt" < ${ymd}::timestamp + interval '1 day'
      GROUP BY "path", "referrerHost", "country", "city",
               "deviceClass", "browser", "os"`,
    prisma.$executeRaw`
      INSERT INTO "AnalyticsDayTotal" ("date", "views", "uniqueVisitors", "rolledUpAt")
      SELECT ${ymd}::date, COUNT(*)::int, COUNT(DISTINCT "visitorHash")::int, NOW()
      FROM "AnalyticsEvent"
      WHERE "occurredAt" >= ${ymd}::timestamp
        AND "occurredAt" < ${ymd}::timestamp + interval '1 day'
      ON CONFLICT ("date") DO UPDATE SET
        "views" = EXCLUDED."views",
        "uniqueVisitors" = EXCLUDED."uniqueVisitors",
        "rolledUpAt" = NOW()`,
  ]);
}

/**
 * Rolls up every completed day not yet rolled up (catches up after missed cron
 * runs). Already-rolled days are never redone: their raw rows may be gone.
 */
export async function rollUpPendingDays(now = new Date()): Promise<string[]> {
  const today = utcYmd(now);
  const oldest = await prisma.analyticsEvent.findFirst({
    where: { occurredAt: { lt: new Date(`${today}T00:00:00Z`) } },
    orderBy: { occurredAt: "asc" },
    select: { occurredAt: true },
  });
  if (!oldest) return [];

  const floor = addDays(today, -MAX_CATCH_UP_DAYS);
  let day = utcYmd(oldest.occurredAt);
  if (day < floor) day = floor;

  const done = await prisma.analyticsDayTotal.findMany({
    where: { date: { gte: new Date(`${day}T00:00:00Z`) } },
    select: { date: true },
  });
  const rolled = new Set(done.map((r) => utcYmd(r.date)));

  const processed: string[] = [];
  for (; day < today; day = addDays(day, 1)) {
    if (rolled.has(day)) continue;
    await rollUpDay(day);
    processed.push(day);
  }
  return processed;
}

/** Deletes raw events older than the retention window — only for rolled-up days. */
export async function purgeRolledUpEvents(now = new Date()): Promise<number> {
  const cutoff = addDays(utcYmd(now), -RAW_RETENTION_DAYS);
  return prisma.$executeRaw`
    DELETE FROM "AnalyticsEvent" e
    USING "AnalyticsDayTotal" t
    WHERE e."occurredAt" < ${cutoff}::timestamp
      AND t."date" = e."occurredAt"::date`;
}
