import { prisma } from "./client";
import { boundedTake, pageWindow, toPage, type PageRequest } from "./pagination";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";

const imageSelect = {
  image: { select: PUBLIC_IMAGE_SELECT },
} as const;

/** Upcoming published events — endAt still in the future (AD-B3-04). */
export async function listPublishedUpcomingEvents(limit = 50) {
  const now = new Date();
  return prisma.event.findMany({
    where: { status: "PUBLISHED", endAt: { gte: now } },
    orderBy: [{ startAt: "asc" }],
    take: boundedTake(limit),
    include: imageSelect,
  });
}

/** Past published events — ended already. */
export async function listPublishedPastEvents(limit = 50) {
  const now = new Date();
  return prisma.event.findMany({
    where: { status: "PUBLISHED", endAt: { lt: now } },
    orderBy: [{ startAt: "desc" }],
    take: boundedTake(limit),
    include: imageSelect,
  });
}

/** Paged past-events archive (`?page=`), most recent first. */
export async function listPublishedPastEventsPage(request: PageRequest = {}) {
  const window = pageWindow(request);
  const where = { status: "PUBLISHED" as const, endAt: { lt: new Date() } };
  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: [{ startAt: "desc" }],
      skip: window.skip,
      take: window.take,
      include: imageSelect,
    }),
    prisma.event.count({ where }),
  ]);
  return toPage(items, total, window);
}

export async function getPublishedEventBySlug(slug: string) {
  return prisma.event.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: imageSelect,
  });
}
