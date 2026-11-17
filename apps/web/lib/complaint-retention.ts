import { kampalaTodayYmd, prisma } from "@repo/database";

/** NAC decision Q4: complaints are kept for 30 days after submission, then deleted. */
export const COMPLAINT_RETENTION_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Calendar date (UTC midnight) on which a complaint is removed. */
export function complaintDeleteOn(submittedOn: Date): Date {
  return new Date(submittedOn.getTime() + COMPLAINT_RETENTION_DAYS * DAY_MS);
}

/** Whole days left before deletion, counted in Kampala calendar days. */
export function complaintDaysLeft(submittedOn: Date, now = new Date()): number {
  const today = new Date(`${kampalaTodayYmd(now)}T00:00:00.000Z`);
  return Math.max(0, Math.round((complaintDeleteOn(submittedOn).getTime() - today.getTime()) / DAY_MS));
}

/**
 * Delete every complaint whose retention period has ended (submittedOn + 30 days <= today).
 * Runs from the daily cron and lazily when admins open complaint pages.
 * Returns only a count — never complaint content.
 */
export async function purgeExpiredComplaints(now = new Date()): Promise<number> {
  const today = new Date(`${kampalaTodayYmd(now)}T00:00:00.000Z`);
  const cutoff = new Date(today.getTime() - COMPLAINT_RETENTION_DAYS * DAY_MS);
  const { count } = await prisma.complaint.deleteMany({
    where: { submittedOn: { lte: cutoff } },
  });
  return count;
}
