import { prisma } from "./client";
import { boundedTake } from "./pagination";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";

/** Homepage partners (AD-B3-07 / E2-07). */
export async function listPublishedPartners(limit = 50) {
  return prisma.partner.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: boundedTake(limit),
    include: { logo: { select: PUBLIC_IMAGE_SELECT } },
  });
}

/** Homepage slideshow / hero slides (AD-B3-07 / E2-02). */
export async function listPublishedSlideshowImages(limit = 20) {
  return prisma.slideshowImage.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: boundedTake(limit),
    include: { media: { select: PUBLIC_IMAGE_SELECT } },
  });
}

/** Homepage featured concepts (AD-B3-07 / E2-06). */
export async function listPublishedFeaturedConcepts(limit = 20) {
  return prisma.featuredConcept.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: boundedTake(limit),
    include: { image: { select: PUBLIC_IMAGE_SELECT } },
  });
}
