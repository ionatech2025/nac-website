import { prisma } from "./client";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";
import { boundedTake } from "./pagination";

/** Key under which the About Us page body is stored in `PageContent`. */
export const ABOUT_PAGE_KEY = "about";

/** Our Staff page (E04) — PUBLISHED team members in admin order. */
export async function listPublishedTeamMembers(limit = 100) {
  return prisma.teamMember.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: boundedTake(limit),
    select: {
      id: true,
      name: true,
      roleTitle: true,
      biography: true,
      photo: { select: PUBLIC_IMAGE_SELECT },
    },
  });
}

/** Programmes list (E05) — PUBLISHED only; strategies come with the detail call. */
export async function listPublishedProgrammes(limit = 50) {
  return prisma.programme.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    take: boundedTake(limit),
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      image: { select: PUBLIC_IMAGE_SELECT },
    },
  });
}

/** Programme detail (E05) — null unless PUBLISHED. */
export async function getPublishedProgrammeBySlug(slug: string) {
  return prisma.programme.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      body: true,
      publishedAt: true,
      updatedAt: true,
      image: { select: PUBLIC_IMAGE_SELECT },
      strategies: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, body: true },
      },
    },
  });
}

/**
 * Static page copy (e.g. About Us). PageContent has no draft state — the
 * admin edits the live text directly — so this simply returns the row or null.
 */
export async function getPageContent(key: string) {
  return prisma.pageContent.findUnique({
    where: { key },
    select: { key: true, title: true, body: true, updatedAt: true },
  });
}

/** Key figures strip (E02 / E03) in admin order. Always public. */
export async function listKeyFigures() {
  return prisma.keyFigure.findMany({
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    take: 20,
    select: { id: true, label: true, value: true },
  });
}

/** Opportunity type filter chips (E08) — only types with published opportunities. */
export async function listOpportunityTypesInUse() {
  return prisma.opportunityType.findMany({
    where: { opportunities: { some: { status: "PUBLISHED" } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });
}
