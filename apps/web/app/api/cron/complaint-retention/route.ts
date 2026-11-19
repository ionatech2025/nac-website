import { NextResponse } from "next/server";
import { purgeExpiredComplaints } from "../../../../lib/complaint-retention";
import { isAuthorizedCron } from "../../../../lib/cron-auth";

/** Daily Vercel Cron (vercel.json): enforce the 30-day complaint retention (Q4). */
export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const deleted = await purgeExpiredComplaints();
    console.log(`[complaint-retention] deleted ${deleted}`);
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    const code = (err as { code?: string }).code ?? "unknown";
    console.error(`[complaint-retention] failed (code ${code})`);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
