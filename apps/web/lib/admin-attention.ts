import { prisma } from "@repo/database";

const MS_DAY = 24 * 60 * 60 * 1000;
const CLOSING_SOON_DAYS = 14;
const UPCOMING_EVENT_DAYS = 30;
const LIST_LIMIT = 5;

export type AttentionSnapshot = {
  newInquiryCount: number;
  /** Count only — never include complaint text (B2-12). */
  newComplaintCount: number;
  closingOpportunities: {
    id: string;
    title: string;
    closingDate: Date;
  }[];
  upcomingEvents: {
    id: string;
    title: string;
    startAt: Date;
  }[];
};

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Server-only dashboard attention data for AD-B2-02. */
export async function getAttentionSnapshot(): Promise<AttentionSnapshot> {
  const now = new Date();
  const today = startOfUtcDay(now);
  const closingUntil = new Date(today.getTime() + CLOSING_SOON_DAYS * MS_DAY);
  const upcomingUntil = new Date(now.getTime() + UPCOMING_EVENT_DAYS * MS_DAY);

  const [
    newInquiryCount,
    newComplaintCount,
    closingOpportunities,
    upcomingEvents,
  ] = await Promise.all([
    prisma.inquiry.count({
      where: { isRead: false, isArchived: false },
    }),
    prisma.complaint.count({
      where: { status: "NEW" },
    }),
    prisma.opportunity.findMany({
      where: {
        status: "PUBLISHED",
        manualStatus: "NONE",
        closingDate: { gte: today, lte: closingUntil },
      },
      orderBy: { closingDate: "asc" },
      take: LIST_LIMIT,
      select: { id: true, title: true, closingDate: true },
    }),
    prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        startAt: { gte: now, lte: upcomingUntil },
      },
      orderBy: { startAt: "asc" },
      take: LIST_LIMIT,
      select: { id: true, title: true, startAt: true },
    }),
  ]);

  return {
    newInquiryCount,
    newComplaintCount,
    closingOpportunities: closingOpportunities.map((row) => ({
      id: row.id,
      title: row.title,
      closingDate: row.closingDate!,
    })),
    upcomingEvents,
  };
}

export const ATTENTION_WINDOWS = {
  closingSoonDays: CLOSING_SOON_DAYS,
  upcomingEventDays: UPCOMING_EVENT_DAYS,
} as const;
