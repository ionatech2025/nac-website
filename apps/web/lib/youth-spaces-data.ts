/**
 * Youth Spaces (E06) — published regions/spaces from `@repo/database`.
 */

import {
  getPublishedYouthSpaceBySlug,
  listPublishedYouthRegions,
  mediaVariantUrl,
} from "@repo/database";

export const YOUTH_SPACES_INTRO =
  "NAC has established youth spaces that work as youth co-creation, youth enterprise incubation and refugee engagement hubs across Uganda. Grassroots organisations use them for administrative support, shared capacity and collective civic action.";

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

export function regionSectionId(name: string): string {
  return `region-${slugify(name)}`;
}

function navRegionLabel(name: string): string {
  if (name === "Western Uganda") return "Western";
  if (name === "Eastern Uganda") return "Eastern";
  return name;
}

function navSpaceLabel(name: string): string {
  return name
    .replace(/\s+Youth\s+(CSO\s+)?(Space|Centre|Center)$/i, "")
    .trim();
}

function toListItem(space: {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  description: string;
  managingPartner: string | null;
  services: string[];
  mapUrl: string | null;
  images: Array<{
    id?: string;
    caption: string | null;
    media: {
      url: string;
      altText: string | null;
      thumbUrl?: string | null;
      mediumUrl?: string | null;
    };
  }>;
}): YouthSpaceListItem {
  return {
    id: space.id,
    name: space.name,
    slug: space.slug,
    location: space.location,
    description: space.description,
    managingPartner: space.managingPartner,
    services: space.services,
    mapUrl: space.mapUrl,
    images: space.images.map((image, index) => ({
      id: image.id ?? `${space.id}-img-${index}`,
      caption: image.caption,
      url: mediaVariantUrl(image.media, "medium"),
      altText:
        image.media.altText?.trim() ||
        image.caption?.trim() ||
        `${space.name} photo`,
    })),
  };
}

export type YouthSpacesNavColumn = {
  heading: string;
  href: string;
  children: { label: string; href: string }[];
};

export async function youthSpacesNavColumns(): Promise<YouthSpacesNavColumn[]> {
  const regions = await listYouthRegions();
  return regions.map((region) => ({
    heading: navRegionLabel(region.name),
    href: `/youth-spaces#${regionSectionId(region.name)}`,
    children: region.spaces.map((space) => ({
      label: navSpaceLabel(space.name),
      href: `/youth-spaces/${space.slug}`,
    })),
  }));
}

export async function youthSpacesNavLinks(): Promise<
  { label: string; href: string }[]
> {
  const regions = await listYouthRegions();
  return [
    { label: "All spaces", href: "/youth-spaces" },
    ...regions.flatMap((region) =>
      region.spaces.map((space) => ({
        label: navSpaceLabel(space.name),
        href: `/youth-spaces/${space.slug}`,
      })),
    ),
  ];
}

export async function listYouthRegions(): Promise<YouthRegionGroup[]> {
  const regions = await listPublishedYouthRegions();
  return regions.map((region) => ({
    id: region.id,
    name: region.name,
    spaces: region.spaces.map(toListItem),
  }));
}

export async function getYouthSpaceBySlug(
  slug: string,
): Promise<YouthSpaceDetail | null> {
  const space = await getPublishedYouthSpaceBySlug(slug);
  if (!space) return null;
  return {
    ...toListItem(space),
    region: { name: space.region.name },
  };
}
