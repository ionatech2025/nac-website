import type { PrismaClient } from "@prisma/client";
import { STARTER_REGIONS } from "./youth-space-starter-data";

export function youthSpaceSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Loads Appendix A regions + spaces (AD-B11-04). Idempotent: regions matched by
 * name, spaces by slug; existing rows are never overwritten, so admin edits
 * survive a re-run. New spaces are drafts for NAC review.
 */
export async function loadStarterYouthSpaces(
  db: PrismaClient,
): Promise<{ regions: number; spaces: number }> {
  let regionsCreated = 0;
  let spacesCreated = 0;

  for (const [regionIndex, region] of STARTER_REGIONS.entries()) {
    const existing = await db.youthRegion.findUnique({ where: { name: region.name } });
    const row =
      existing ??
      (await db.youthRegion.create({
        data: { name: region.name, sortOrder: regionIndex },
      }));
    if (!existing) regionsCreated += 1;

    for (const [spaceIndex, space] of region.spaces.entries()) {
      const slug = youthSpaceSlug(space.name);
      const found = await db.youthSpace.findUnique({ where: { slug }, select: { id: true } });
      if (found) continue;
      await db.youthSpace.create({
        data: {
          regionId: row.id,
          name: space.name,
          slug,
          location: space.location ?? null,
          managingPartner: space.managingPartner ?? null,
          description: space.description,
          services: space.services,
          sortOrder: spaceIndex,
          status: "DRAFT",
        },
      });
      spacesCreated += 1;
    }
  }

  return { regions: regionsCreated, spaces: spacesCreated };
}
