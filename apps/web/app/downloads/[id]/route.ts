import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { isLikelyBot } from "../../../lib/analytics/should-track";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Stable public document link (AD-B7-03): /downloads/<documentId> always
 * redirects to the current file, so replacing a PDF never breaks shared links.
 * Also the single place downloadCount is incremented (humans, GET only).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID.test(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const doc = await prisma.document.findFirst({
    where: { id, status: "PUBLISHED" },
    select: { media: { select: { url: true } } },
  });
  if (!doc) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ua = request.headers.get("user-agent") ?? "";
  if (request.method === "GET" && !isLikelyBot(ua)) {
    await prisma.document
      .update({ where: { id }, data: { downloadCount: { increment: 1 } } })
      .catch(() => undefined);
  }

  const target = new URL(doc.media.url, request.url);
  const response = NextResponse.redirect(target, 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
