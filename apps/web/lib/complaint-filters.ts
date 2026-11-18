import type { ComplaintStatus, Prisma } from "@repo/database";

export const COMPLAINT_VIEWS = ["new", "reviewed", "closed", "all"] as const;
export type ComplaintView = (typeof COMPLAINT_VIEWS)[number];

export const COMPLAINT_STATUSES: ComplaintStatus[] = ["NEW", "REVIEWED", "CLOSED"];
export const COMPLAINT_PAGE_SIZE = 25;

export type ComplaintFilters = {
  view: ComplaintView;
  q: string;
  category: string;
  from: string;
  to: string;
  page: number;
};

export type ComplaintSearchParams = Partial<Record<keyof ComplaintFilters, string>>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** `submittedOn` is a calendar date column: compare against UTC midnight. */
const dateOnly = (ymd: string) => new Date(`${ymd}T00:00:00.000Z`);

export function parseComplaintFilters(sp: ComplaintSearchParams): ComplaintFilters {
  const view = (COMPLAINT_VIEWS as readonly string[]).includes(sp.view ?? "")
    ? (sp.view as ComplaintView)
    : "new";
  return {
    view,
    q: (sp.q ?? "").trim().slice(0, 100),
    category: (sp.category ?? "").trim().slice(0, 120),
    from: DATE_RE.test(sp.from ?? "") ? sp.from! : "",
    to: DATE_RE.test(sp.to ?? "") ? sp.to! : "",
    page: Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1),
  };
}

export function complaintWhere(f: ComplaintFilters): Prisma.ComplaintWhereInput {
  const where: Prisma.ComplaintWhereInput = {};
  if (f.view !== "all") where.status = f.view.toUpperCase() as ComplaintStatus;
  if (f.category === "__none") where.category = null;
  else if (f.category) where.category = f.category;
  if (f.from || f.to) {
    where.submittedOn = {
      ...(f.from ? { gte: dateOnly(f.from) } : {}),
      ...(f.to ? { lte: dateOnly(f.to) } : {}),
    };
  }
  if (f.q) {
    where.OR = [
      { description: { contains: f.q, mode: "insensitive" } },
      { programmeOrPlace: { contains: f.q, mode: "insensitive" } },
      { category: { contains: f.q, mode: "insensitive" } },
    ];
  }
  return where;
}

export function complaintListHref(
  f: ComplaintFilters,
  overrides: Partial<ComplaintFilters> = {},
): string {
  const m = { ...f, ...overrides };
  const params = new URLSearchParams();
  if (m.view !== "new") params.set("view", m.view);
  if (m.q) params.set("q", m.q);
  if (m.category) params.set("category", m.category);
  if (m.from) params.set("from", m.from);
  if (m.to) params.set("to", m.to);
  if (m.page > 1) params.set("page", String(m.page));
  const qs = params.toString();
  return qs ? `/admin/complaints?${qs}` : "/admin/complaints";
}

export function hasActiveComplaintFilters(f: ComplaintFilters): boolean {
  return Boolean(f.q || f.category || f.from || f.to);
}

export const COMPLAINT_STATUS_LABEL: Record<ComplaintStatus, string> = {
  NEW: "New",
  REVIEWED: "Reviewed",
  CLOSED: "Closed",
};

/** Calendar-date columns are stored at UTC midnight; format without shifting. */
export function formatComplaintDate(d: Date, withWeekday = false): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    ...(withWeekday ? { weekday: "short" } : {}),
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
