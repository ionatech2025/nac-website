import type { Prisma } from "@repo/database";

export const INQUIRY_VIEWS = ["inbox", "unread", "read", "archived"] as const;
export type InquiryView = (typeof INQUIRY_VIEWS)[number];

export const INQUIRY_PAGE_SIZE = 25;

export type InquiryFilters = {
  view: InquiryView;
  q: string;
  from: string;
  to: string;
  page: number;
};

export type InquirySearchParams = {
  view?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Kampala calendar day (UTC+3) → UTC instant at the start or end of that day. */
function kampalaDay(value: string, edge: "start" | "end"): Date | null {
  if (!DATE_RE.test(value)) return null;
  const time = edge === "start" ? "00:00:00.000" : "23:59:59.999";
  const d = new Date(`${value}T${time}+03:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseInquiryFilters(sp: InquirySearchParams): InquiryFilters {
  const view = (INQUIRY_VIEWS as readonly string[]).includes(sp.view ?? "")
    ? (sp.view as InquiryView)
    : "inbox";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  return {
    view,
    q: (sp.q ?? "").trim().slice(0, 100),
    from: DATE_RE.test(sp.from ?? "") ? sp.from! : "",
    to: DATE_RE.test(sp.to ?? "") ? sp.to! : "",
    page,
  };
}

export function inquiryWhere(f: InquiryFilters): Prisma.InquiryWhereInput {
  const where: Prisma.InquiryWhereInput = {
    isArchived: f.view === "archived",
  };
  if (f.view === "unread") where.isRead = false;
  if (f.view === "read") where.isRead = true;

  const from = f.from ? kampalaDay(f.from, "start") : null;
  const to = f.to ? kampalaDay(f.to, "end") : null;
  if (from || to) {
    where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };
  }

  if (f.q) {
    where.OR = [
      { name: { contains: f.q, mode: "insensitive" } },
      { email: { contains: f.q, mode: "insensitive" } },
      { subject: { contains: f.q, mode: "insensitive" } },
      { message: { contains: f.q, mode: "insensitive" } },
    ];
  }
  return where;
}

/** Build a list URL that keeps current filters, with overrides. */
export function inquiryListHref(
  f: InquiryFilters,
  overrides: Partial<InquiryFilters> = {},
): string {
  const merged = { ...f, ...overrides };
  const params = new URLSearchParams();
  if (merged.view !== "inbox") params.set("view", merged.view);
  if (merged.q) params.set("q", merged.q);
  if (merged.from) params.set("from", merged.from);
  if (merged.to) params.set("to", merged.to);
  if (merged.page > 1) params.set("page", String(merged.page));
  const qs = params.toString();
  return qs ? `/admin/inquiries?${qs}` : "/admin/inquiries";
}

export function hasActiveInquiryFilters(f: InquiryFilters): boolean {
  return Boolean(f.q || f.from || f.to);
}
