/**
 * Opportunities (E08) — published opportunities from `@repo/database`.
 */

import {
  dateOnlyYmd,
  getPublishedOpportunityBySlug,
  labelDerivedOpportunityStatus,
  listOpportunityTypesInUse,
  listPublishedOpportunities,
} from "@repo/database";

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

function toItem(row: Awaited<
  ReturnType<typeof listPublishedOpportunities>
>[number]): OpportunityItem | null {
  if (row.derivedStatus === "ARCHIVED") return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    type: row.type
      ? { id: row.type.id, name: row.type.name, slug: row.type.slug }
      : null,
    openingDate: row.openingDate ? dateOnlyYmd(row.openingDate) : null,
    closingDate: row.closingDate ? dateOnlyYmd(row.closingDate) : null,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    applicationInstructions: row.applicationInstructions,
    attachments: row.attachments.map((attachment) => ({
      id: attachment.id,
      title: attachment.title?.trim() || attachment.media.fileName,
      href: attachment.media.url,
      fileName: attachment.media.fileName,
      byteSize: attachment.media.byteSize ?? undefined,
    })),
    derivedStatus: row.derivedStatus === "OPEN" ? "OPEN" : "CLOSED",
  };
}

export function labelStatus(status: DerivedStatus): string {
  return labelDerivedOpportunityStatus(status);
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
  return listOpportunityTypesInUse();
}

export async function listOpportunities(
  filters: OpportunityFilters = {},
): Promise<OpportunityItem[]> {
  const status = filters.status ?? "all";
  const typeSlug = filters.type?.trim() || "";
  const sort = filters.sort ?? "closing-asc";
  const from = filters.closingFrom?.trim() || "";
  const to = filters.closingTo?.trim() || "";

  const published = (await listPublishedOpportunities())
    .map(toItem)
    .filter((row): row is OpportunityItem => row !== null);

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
  const row = await getPublishedOpportunityBySlug(slug);
  return row ? toItem(row) : null;
}
