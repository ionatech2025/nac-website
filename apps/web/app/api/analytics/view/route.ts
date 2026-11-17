import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { apiError } from "../../../../lib/api-response";
import { parseAnalyticsPayload } from "../../../../lib/analytics/parse-request";
import {
  DEDUPE_WINDOW_MS,
  isLikelyBot,
  shouldTrackPath,
} from "../../../../lib/analytics/should-track";
import { buildVisitorHash } from "../../../../lib/analytics/visitor-hash";

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (isLikelyBot(ua)) {
    return NextResponse.json({ ok: true, skipped: "bot" });
  }

  let body: { path?: string; referrer?: string | null };
  try {
    body = (await request.json()) as { path?: string; referrer?: string | null };
  } catch {
    return apiError("invalid");
  }

  const parsed = parseAnalyticsPayload(body, request.headers);
  if (!parsed || !shouldTrackPath(parsed.path)) {
    return NextResponse.json({ ok: true, skipped: "path" });
  }

  const visitorHash = buildVisitorHash({
    userAgent: ua,
    acceptLanguage: request.headers.get("accept-language") ?? "",
    forwardedFor: request.headers.get("x-forwarded-for"),
  });

  const since = new Date(Date.now() - DEDUPE_WINDOW_MS);
  const recent = await prisma.analyticsEvent.findFirst({
    where: {
      visitorHash,
      path: parsed.path,
      occurredAt: { gte: since },
    },
    select: { id: true },
  });
  if (recent) {
    return NextResponse.json({ ok: true, skipped: "dedupe" });
  }

  await prisma.analyticsEvent.create({
    data: {
      path: parsed.path,
      referrerHost: parsed.referrerHost,
      country: parsed.country,
      region: parsed.region,
      city: parsed.city,
      deviceClass: parsed.deviceClass,
      browser: parsed.browser,
      os: parsed.os,
      visitorHash,
    },
  });

  return NextResponse.json({ ok: true });
}
