import { NextResponse } from "next/server";
import {
  purgeRolledUpEvents,
  rollUpPendingDays,
} from "../../../../lib/analytics/rollup";
import { isAuthorizedCron } from "../../../../lib/cron-auth";

/**
 * Daily Vercel Cron (vercel.json), 00:15 UTC so yesterday is complete:
 * summarise raw page views into AnalyticsDaily, then drop old raw rows (AD-B8-02).
 */
export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const rolledUp = await rollUpPendingDays();
    const purged = await purgeRolledUpEvents();
    console.log(`[analytics-rollup] days ${rolledUp.length}, purged ${purged}`);
    return NextResponse.json({ ok: true, rolledUp, purged });
  } catch (err) {
    const code = (err as { code?: string }).code ?? "unknown";
    console.error(`[analytics-rollup] failed (code ${code})`);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
