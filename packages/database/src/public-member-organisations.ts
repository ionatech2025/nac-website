import { prisma } from "./client";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";
import { boundedTake } from "./pagination";

const IMAGE_ORDER = [{ sortOrder: "asc" as const }, { id: "asc" as const }];

const GALLERY_IMAGE = {
  id: true,
  caption: true,
  media: { select: PUBLIC_IMAGE_SELECT },
} as const;

/**
 * Member organisations listing (E16) — PUBLISHED only.
 * First gallery image is the card cover (up to 3 total on detail).
 */
export async function listPublishedMemberOrganisations(limit = 100) {
  return prisma.memberOrganisation.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: boundedTake(limit),
    select: {
      id: true,
      name: true,
      slug: true,
      bio: true,
      websiteUrl: true,
      images: {
        orderBy: IMAGE_ORDER,
        take: 1,
        select: GALLERY_IMAGE,
      },
    },
  });
}

/** Member organisation detail — null unless PUBLISHED. */
export async function getPublishedMemberOrganisationBySlug(slug: string) {
  return prisma.memberOrganisation.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      name: true,
      slug: true,
      bio: true,
      websiteUrl: true,
      updatedAt: true,
      images: {
        orderBy: IMAGE_ORDER,
        select: GALLERY_IMAGE,
      },
    },
  });
}
