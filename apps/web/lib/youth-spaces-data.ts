/**
 * Youth Spaces seed/fallback for Epic E6 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers later.
 * No database access from this module.
 */

import {
  SEED_YOUTH_REGIONS,
  YOUTH_SPACES_INTRO,
  type SeedSpace,
} from "./youth-spaces-seed";

export { YOUTH_SPACES_INTRO };

export type YouthSpaceImage = {
  id: string;
  caption: string | null;
  url: string;
  altText: string;
};

export type YouthSpaceListItem = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  description: string;
  managingPartner: string | null;
  services: string[];
  mapUrl: string | null;
  images: YouthSpaceImage[];
};

export type YouthRegionGroup = {
  id: string;
  name: string;
  spaces: YouthSpaceListItem[];
};

export type YouthSpaceDetail = YouthSpaceListItem & {
  region: { name: string };
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function regionAnchor(name: string): string {
  return `region-${slugify(name)}`;
}

function toListItem(space: SeedSpace, index: number): YouthSpaceListItem {
  const slug = slugify(space.name);
  return {
    id: `${slug}-${index}`,
    name: space.name,
    slug,
    location: space.location ?? null,
    description: space.description,
    managingPartner: space.managingPartner ?? null,
    services: space.services,
    mapUrl: space.mapUrl ?? null,
    images: [],
  };
}

const seedRegions: YouthRegionGroup[] = SEED_YOUTH_REGIONS.map(
  (region, regionIndex) => ({
    id: `region-${regionIndex}`,
    name: region.name,
    spaces: region.spaces.map((space, spaceIndex) =>
      toListItem(space, spaceIndex),
    ),
  }),
).filter((region) => region.spaces.length > 0);

const seedBySlug = new Map<string, YouthSpaceDetail>(
  seedRegions.flatMap((region) =>
    region.spaces.map((space) => [
      space.slug,
      { ...space, region: { name: region.name } },
    ]),
  ),
);

export function regionSectionId(name: string): string {
  return regionAnchor(name);
}

/** Landing (FE-E6-01/02): regions in order; empty regions omitted. */
export async function listYouthRegions(): Promise<YouthRegionGroup[]> {
  return seedRegions;
}

/** Detail (FE-E6-03): null for unknown/unpublished. */
export async function getYouthSpaceBySlug(
  slug: string,
): Promise<YouthSpaceDetail | null> {
  return seedBySlug.get(slug) ?? null;
}
