import { prisma } from "./client";
import { boundedTake } from "./pagination";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";

/** Published video links for embeds (AD-B3-05 / E10-04). */
export async function listPublishedVideos(limit = 50) {
  return prisma.videoLink.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: boundedTake(limit),
    include: {
      thumbnailMedia: { select: PUBLIC_IMAGE_SELECT },
    },
  });
}

export async function getPublishedVideoById(id: string) {
  return prisma.videoLink.findFirst({
    where: { id, status: "PUBLISHED" },
    include: {
      thumbnailMedia: { select: PUBLIC_IMAGE_SELECT },
    },
  });
}
