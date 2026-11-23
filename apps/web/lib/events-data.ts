/**
 * Events seed/fallback for Epic E9 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers later.
 */

import { SEED_EVENTS, type SeedEvent } from "./events-seed";

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

function toPublic(row: SeedEvent): PublicEvent | null {
  if (row.status !== "PUBLISHED" && row.status !== "CANCELLED") return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    startAt: row.startAt,
    endAt: row.endAt,
    timezone: row.timezone || "Africa/Kampala",
    location: row.location,
    image: row.imageUrl
      ? { url: row.imageUrl, altText: row.imageAlt ?? row.title }
      : null,
    registrationUrl: row.registrationUrl,
    contact: row.contact,
    cancelled: row.status === "CANCELLED",
  };
}

const publicEvents = SEED_EVENTS.map(toPublic).filter(
  (row): row is PublicEvent => row !== null,
);

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
  const now = Date.now();
  return publicEvents
    .filter((event) => new Date(event.endAt).getTime() >= now)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .slice(0, Math.min(Math.max(limit, 1), 100));
}

export async function listPastEventsPage(request: {
  page?: number;
  pageSize?: number;
} = {}): Promise<EventsPage> {
  const pageSize = Math.min(Math.max(Math.floor(request.pageSize ?? 12) || 12, 1), 100);
  const now = Date.now();
  const past = publicEvents
    .filter((event) => new Date(event.endAt).getTime() < now)
    .sort((a, b) => b.startAt.localeCompare(a.startAt));
  const pageCount = Math.max(1, Math.ceil(past.length / pageSize));
  const page = Math.min(Math.max(Math.floor(Number(request.page)) || 1, 1), pageCount);
  const start = (page - 1) * pageSize;
  return {
    items: past.slice(start, start + pageSize),
    page,
    pageSize,
    total: past.length,
    pageCount,
  };
}

export async function listAllPublicEvents(): Promise<PublicEvent[]> {
  return [...publicEvents].sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export async function getEventBySlug(slug: string): Promise<PublicEvent | null> {
  return publicEvents.find((event) => event.slug === slug) ?? null;
}
