/**
 * Opportunities seed/fallback for Epic E8 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers later.
 */

import {
  SEED_OPPORTUNITIES,
  SEED_OPPORTUNITY_TYPES,
  type SeedOpportunity,
} from "./opportunities-seed";

export type DerivedStatus = "OPEN" | "CLOSED";

export type OpportunityType = {
  id: string;
  name: string;
  slug: string;
};

export type OpportunityAttachment = {
  id: string;
  title: string;
  href: string;
  fileName: string;
  byteSize?: number;
};

export type OpportunityItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: OpportunityType | null;
  openingDate: string | null;
  closingDate: string | null;
  contactEmail: string;
  contactPhone: string | null;
  applicationInstructions: string | null;
  attachments: OpportunityAttachment[];
  derivedStatus: DerivedStatus;
};

export type OpportunityFilters = {
  status?: "open" | "closed" | "all";
  type?: string;
  sort?: "closing-asc" | "closing-desc";
  closingFrom?: string;
  closingTo?: string;
};

function kampalaTodayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Mirror Dev B deriveOpportunityStatus for published seed rows. */
function deriveStatus(opp: SeedOpportunity, now = new Date()): DerivedStatus | "ARCHIVED" {
  if (opp.status === "ARCHIVED" || opp.manualStatus === "ARCHIVED") return "ARCHIVED";
  if (opp.manualStatus === "CLOSED") return "CLOSED";
  const today = kampalaTodayYmd(now);
  if (opp.openingDate && today < opp.openingDate) return "CLOSED";
  if (opp.closingDate && today > opp.closingDate) return "CLOSED";
  return "OPEN";
}

function toItem(row: SeedOpportunity): OpportunityItem | null {
  if (row.status !== "PUBLISHED") return null;
  const derived = deriveStatus(row);
  if (derived === "ARCHIVED") return null;
  const type =
    SEED_OPPORTUNITY_TYPES.find((t) => t.slug === row.typeSlug) ?? null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    type,
    openingDate: row.openingDate,
    closingDate: row.closingDate,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    applicationInstructions: row.applicationInstructions,
    attachments: row.attachments,
    derivedStatus: derived,
  };
}

const published = SEED_OPPORTUNITIES.map(toItem).filter(
  (row): row is OpportunityItem => row !== null,
);

export function labelStatus(status: DerivedStatus): string {
  return status === "OPEN" ? "Open" : "Closed";
}

export function formatOpportunityDate(ymd: string | null): string | null {
  if (!ymd) return null;
  const date = new Date(`${ymd}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function applyMailto(email: string, title: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(`Application: ${title}`)}`;
}

export async function listOpportunityTypes(): Promise<OpportunityType[]> {
  const used = new Set(
    published.map((item) => item.type?.slug).filter(Boolean) as string[],
  );
  return SEED_OPPORTUNITY_TYPES.filter((type) => used.has(type.slug));
}

export async function listOpportunities(
  filters: OpportunityFilters = {},
): Promise<OpportunityItem[]> {
  const status = filters.status ?? "all";
  const typeSlug = filters.type?.trim() || "";
  const sort = filters.sort ?? "closing-asc";
  const from = filters.closingFrom?.trim() || "";
  const to = filters.closingTo?.trim() || "";

  let items = published.filter((item) => {
    if (status === "open" && item.derivedStatus !== "OPEN") return false;
    if (status === "closed" && item.derivedStatus !== "CLOSED") return false;
    if (typeSlug && item.type?.slug !== typeSlug) return false;
    if (from && (!item.closingDate || item.closingDate < from)) return false;
    if (to && (!item.closingDate || item.closingDate > to)) return false;
    return true;
  });

  items = [...items].sort((a, b) => {
    const aClose = a.closingDate ?? "9999-12-31";
    const bClose = b.closingDate ?? "9999-12-31";
    const cmp = aClose.localeCompare(bClose) || a.title.localeCompare(b.title);
    return sort === "closing-desc" ? -cmp : cmp;
  });

  return items;
}

export async function getOpportunityBySlug(
  slug: string,
): Promise<OpportunityItem | null> {
  return published.find((item) => item.slug === slug) ?? null;
}
