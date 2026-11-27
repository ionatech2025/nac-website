/**
 * Events (E09) — published events from `@repo/database`.
 */

import {
  getPublishedEventBySlug,
  listPublishedPastEvents,
  listPublishedPastEventsPage,
  listPublishedUpcomingEvents,
  mediaVariantUrl,
} from "@repo/database";

export type EventImage = { url: string; altText: string };

export type PublicEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location: string | null;
  image: EventImage | null;
  registrationUrl: string | null;
  contact: string | null;
  cancelled: boolean;
};

export type EventsPage = {
  items: PublicEvent[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

function toPublic(row: {
  id: string;
  title: string;
  slug: string;
  description: string;
  startAt: Date;
  endAt: Date;
  timezone: string;
  location: string | null;
  registrationUrl: string | null;
  contact: string | null;
  status: string;
  image: {
    url: string;
    altText: string | null;
    thumbUrl?: string | null;
    mediumUrl?: string | null;
  } | null;
}): PublicEvent {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    startAt: row.startAt.toISOString(),
    endAt: row.endAt.toISOString(),
    timezone: row.timezone || "Africa/Kampala",
    location: row.location,
    image: row.image
      ? {
          url: mediaVariantUrl(row.image, "medium"),
          altText: row.image.altText?.trim() || row.title,
        }
      : null,
    registrationUrl: row.registrationUrl,
    contact: row.contact,
    cancelled: row.status === "CANCELLED",
  };
}

function formatInZone(
  iso: string,
  timezone: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: timezone, ...options }).format(
    new Date(iso),
  );
}

export function formatEventWhen(event: PublicEvent): string {
  const zone = event.timezone;
  const startDay = formatInZone(event.startAt, zone, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const startTime = formatInZone(event.startAt, zone, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = formatInZone(event.endAt, zone, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endDay = formatInZone(event.endAt, zone, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const sameDay =
    formatInZone(event.startAt, zone, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) ===
    formatInZone(event.endAt, zone, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  return sameDay
    ? `${startDay}, ${startTime}–${endTime} (${zone.replace("_", " ")})`
    : `${startDay} ${startTime} → ${endDay} ${endTime} (${zone.replace("_", " ")})`;
}

export async function listUpcomingEvents(limit = 50): Promise<PublicEvent[]> {
  const rows = await listPublishedUpcomingEvents(limit);
  return rows.map(toPublic);
}

export async function listPastEventsPage(request: {
  page?: number;
  pageSize?: number;
} = {}): Promise<EventsPage> {
  const page = await listPublishedPastEventsPage(request);
  return {
    items: page.items.map(toPublic),
    page: page.page,
    pageSize: page.pageSize,
    total: page.total,
    pageCount: page.pageCount,
  };
}

export async function listAllPublicEvents(): Promise<PublicEvent[]> {
  const [upcoming, past] = await Promise.all([
    listPublishedUpcomingEvents(100),
    listPublishedPastEvents(100),
  ]);
  return [...upcoming, ...past]
    .map(toPublic)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export async function getEventBySlug(slug: string): Promise<PublicEvent | null> {
  const row = await getPublishedEventBySlug(slug);
  return row ? toPublic(row) : null;
}
