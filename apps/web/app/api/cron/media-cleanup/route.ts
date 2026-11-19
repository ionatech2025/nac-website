import { NextResponse } from "next/server";
import { isAuthorizedCron } from "../../../../lib/cron-auth";
import { purgeOrphanMedia } from "../../../../lib/media-cleanup";

/**
 * Daily Vercel Cron (vercel.json): delete media no content row references any
 * more — replaced photos, removed attachments, abandoned uploads (AD-B7-03).
 */
export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const deleted = await purgeOrphanMedia();
    console.log(`[media-cleanup] deleted ${deleted}`);
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    const code = (err as { code?: string }).code ?? "unknown";
    console.error(`[media-cleanup] failed (code ${code})`);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
