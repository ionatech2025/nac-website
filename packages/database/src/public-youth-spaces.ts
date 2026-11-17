import { prisma } from "./client";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";

const SPACE_ORDER = [{ sortOrder: "asc" as const }, { name: "asc" as const }];
const IMAGE_ORDER = [{ sortOrder: "asc" as const }, { id: "asc" as const }];

const SPACE_FIELDS = {
  id: true,
  name: true,
  slug: true,
  location: true,
  description: true,
  managingPartner: true,
  services: true,
  mapUrl: true,
} as const;

/**
 * Youth Spaces landing (FE-E6-01/02): regions in admin order with their
 * PUBLISHED spaces and each space's first photo. Empty regions are dropped.
 */
export async function listPublishedYouthRegions() {
  const regions = await prisma.youthRegion.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      spaces: {
        where: { status: "PUBLISHED" },
        orderBy: SPACE_ORDER,
        select: {
          ...SPACE_FIELDS,
          images: {
            orderBy: IMAGE_ORDER,
            take: 1,
            select: { caption: true, media: { select: PUBLIC_IMAGE_SELECT } },
          },
        },
      },
    },
  });
  return regions.filter((region) => region.spaces.length > 0);
}

/** Space detail (FE-E6-03): null unless PUBLISHED. */
export async function getPublishedYouthSpaceBySlug(slug: string) {
  return prisma.youthSpace.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      ...SPACE_FIELDS,
      updatedAt: true,
      region: { select: { id: true, name: true } },
      images: {
        orderBy: IMAGE_ORDER,
        select: { id: true, caption: true, media: { select: PUBLIC_IMAGE_SELECT } },
      },
    },
  });
}
