import { prisma, type Prisma } from "@repo/database";
import { deleteObjects, type StoredObject } from "./storage";

/** Uploads younger than this are never swept — the form may still be saving. */
export const ORPHAN_GRACE_HOURS = 24;

/**
 * "No row points at this asset". Must list every MediaAsset relation: optional
 * relations default to SetNull, so deleting a still-used asset would silently
 * blank a photo elsewhere instead of failing.
 */
const UNUSED: Prisma.MediaAssetWhereInput = {
  programmeGalleryImages: { none: {} },
  aboutPageImages: { none: {} },
  teamMemberPhotos: { none: {} },
  articleCovers: { none: {} },
  articleOgImages: { none: {} },
  opportunityAttachments: { none: {} },
  eventImages: { none: {} },
  albumCovers: { none: {} },
  photoImages: { none: {} },
  videoThumbnails: { none: {} },
  documents: { none: {} },
  partnerLogos: { none: {} },
  featuredConceptImages: { none: {} },
  slideshowImages: { none: {} },
  youthSpaceImages: { none: {} },
};

type MediaFiles = {
  url: string;
  storageKey: string;
  thumbUrl: string | null;
  thumbKey: string | null;
  mediumUrl: string | null;
  mediumKey: string | null;
};

const FILE_FIELDS = {
  id: true,
  url: true,
  storageKey: true,
  thumbUrl: true,
  thumbKey: true,
  mediumUrl: true,
  mediumKey: true,
} as const;

function objectsOf(media: MediaFiles): StoredObject[] {
  const objects: StoredObject[] = [{ url: media.url, key: media.storageKey }];
  if (media.thumbUrl && media.thumbKey) {
    objects.push({ url: media.thumbUrl, key: media.thumbKey });
  }
  if (media.mediumUrl && media.mediumKey) {
    objects.push({ url: media.mediumUrl, key: media.mediumKey });
  }
  return objects;
}

async function deleteRows(rows: (MediaFiles & { id: string })[]): Promise<number> {
  if (rows.length === 0) return 0;
  const { count } = await prisma.mediaAsset.deleteMany({
    where: { AND: [{ id: { in: rows.map((r) => r.id) } }, UNUSED] },
  });
  await deleteObjects(rows.flatMap(objectsOf));
  return count;
}

/** Deletes the assets (row + stored files) only if nothing references them. */
export async function deleteMediaIfUnused(
  ids: (string | null | undefined)[],
): Promise<number> {
  const wanted = ids.filter((id): id is string => Boolean(id));
  if (wanted.length === 0) return 0;
  const rows = await prisma.mediaAsset.findMany({
    where: { AND: [{ id: { in: wanted } }, UNUSED] },
    select: FILE_FIELDS,
  });
  return deleteRows(rows);
}

/** Sweeps uploads that were replaced or abandoned (daily cron). */
export async function purgeOrphanMedia(limit = 200): Promise<number> {
  const cutoff = new Date(Date.now() - ORPHAN_GRACE_HOURS * 3600_000);
  const rows = await prisma.mediaAsset.findMany({
    where: { AND: [{ createdAt: { lt: cutoff } }, UNUSED] },
    select: FILE_FIELDS,
    orderBy: { createdAt: "asc" },
    take: limit,
  });
  return deleteRows(rows);
}
