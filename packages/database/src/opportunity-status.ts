/**
 * Opportunity listing status (requirements §8 / E8-05).
 * Calculated on read — no scheduler. End-of-day = Africa/Kampala calendar date.
 */

export type DerivedOpportunityStatus = "OPEN" | "CLOSED" | "ARCHIVED";

export type OpportunityStatusInput = {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  manualStatus: "NONE" | "CLOSED" | "ARCHIVED";
  openingDate: Date | null;
  closingDate: Date | null;
};

/** Today's calendar date in Africa/Kampala as YYYY-MM-DD. */
export function kampalaTodayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Date-only fields from Prisma (@db.Date) as YYYY-MM-DD. */
export function dateOnlyYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Public listing status for a published opportunity.
 * Draft records should not be listed publicly; callers filter status=PUBLISHED first.
 */
export function deriveOpportunityStatus(
  opp: OpportunityStatusInput,
  now = new Date(),
): DerivedOpportunityStatus {
  if (opp.status === "ARCHIVED" || opp.manualStatus === "ARCHIVED") {
    return "ARCHIVED";
  }
  if (opp.manualStatus === "CLOSED") {
    return "CLOSED";
  }

  const today = kampalaTodayYmd(now);

  if (opp.openingDate) {
    const openYmd = dateOnlyYmd(opp.openingDate);
    if (today < openYmd) {
      return "CLOSED";
    }
  }

  if (opp.closingDate) {
    const closeYmd = dateOnlyYmd(opp.closingDate);
    // Closed after the end of the closing date (Kampala) ⇒ when today > closeYmd.
    if (today > closeYmd) {
      return "CLOSED";
    }
  }

  return "OPEN";
}

export function labelDerivedOpportunityStatus(
  status: DerivedOpportunityStatus,
): string {
  switch (status) {
    case "OPEN":
      return "Open";
    case "CLOSED":
      return "Closed";
    case "ARCHIVED":
      return "Archived";
  }
}
