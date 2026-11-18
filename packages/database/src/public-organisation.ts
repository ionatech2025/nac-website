import { prisma } from "./client";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";
import { boundedTake } from "./pagination";

/** Legacy PageContent key; prefer `getPublishedAboutPage` for About Us. */
export const ABOUT_PAGE_KEY = "about";

const IMAGE_ORDER = [{ sortOrder: "asc" as const }, { id: "asc" as const }];

const GALLERY_IMAGE = {
  id: true,
  caption: true,
  media: { select: PUBLIC_IMAGE_SELECT },
} as const;

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

/** Programmes list (E05) — first gallery image is the card cover. */
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
      images: {
        orderBy: IMAGE_ORDER,
        take: 1,
        select: GALLERY_IMAGE,
      },
    },
  });
}

/** Programme detail (E05) — null unless PUBLISHED. Includes up to 3 images. */
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
      images: {
        orderBy: IMAGE_ORDER,
        select: GALLERY_IMAGE,
      },
      strategies: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, body: true },
      },
    },
  });
}

/**
 * Static page copy (privacy, etc.). About Us uses `getPublishedAboutPage`.
 * PageContent has no draft state — admin edits go live immediately.
 */
export async function getPageContent(key: string) {
  return prisma.pageContent.findUnique({
    where: { key },
    select: { key: true, title: true, body: true, updatedAt: true },
  });
}

/**
 * About Us (E03): structured mission/vision/whatWeDo/why + up to 2 images.
 * Creates the singleton row if missing (migrates legacy PageContent once).
 */
export async function getPublishedAboutPage() {
  await ensureAboutPage();
  return prisma.aboutPage.findUnique({
    where: { id: "about" },
    select: {
      title: true,
      mission: true,
      vision: true,
      whatWeDo: true,
      why: true,
      updatedAt: true,
      images: {
        orderBy: IMAGE_ORDER,
        select: GALLERY_IMAGE,
      },
    },
  });
}

/** Idempotent bootstrap for the About singleton (admin + public). */
export async function ensureAboutPage() {
  const existing = await prisma.aboutPage.findUnique({
    where: { id: "about" },
    select: { id: true },
  });
  if (existing) return;

  const legacy = await prisma.pageContent.findUnique({
    where: { key: ABOUT_PAGE_KEY },
    select: { title: true, body: true },
  });

  await prisma.aboutPage.create({
    data: {
      id: "about",
      title: legacy?.title || "About us",
      whatWeDo: legacy?.body || "",
    },
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
