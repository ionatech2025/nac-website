import { prisma } from "./client";
import { boundedTake } from "./pagination";
import {
  deriveOpportunityStatus,
  type DerivedOpportunityStatus,
} from "./opportunity-status";

export type PublicOpportunity = Awaited<
  ReturnType<typeof listPublishedOpportunities>
>[number];

/** Public list — PUBLISHED only, with derived Open/Closed/Archived (AD-B3-03). */
export async function listPublishedOpportunities(limit = 100) {
  const rows = await prisma.opportunity.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ closingDate: "asc" }, { title: "asc" }],
    take: boundedTake(limit),
    include: {
      type: true,
      attachments: {
        orderBy: { sortOrder: "asc" },
        include: { media: { select: { url: true, fileName: true, byteSize: true } } },
      },
    },
  });

  return rows
    .map((row) => {
      const derivedStatus: DerivedOpportunityStatus = deriveOpportunityStatus(row);
      return { ...row, derivedStatus };
    })
    .filter((row) => row.derivedStatus !== "ARCHIVED");
}

export async function getPublishedOpportunityBySlug(slug: string) {
  const row = await prisma.opportunity.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      type: true,
      attachments: {
        orderBy: { sortOrder: "asc" },
        include: { media: { select: { url: true, fileName: true, byteSize: true } } },
      },
    },
  });
  if (!row) return null;
  const derivedStatus = deriveOpportunityStatus(row);
  if (derivedStatus === "ARCHIVED") return null;
  return { ...row, derivedStatus };
}
