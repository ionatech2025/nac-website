/**
 * Programmes (E05) — published programmes from `@repo/database`.
 */

import {
  getPublishedProgrammeBySlug,
  listPublishedProgrammes,
  mediaVariantUrl,
} from "@repo/database";

export type ProgrammeImage = {
  id: string;
  caption: string | null;
  url: string;
  altText: string;
};

export type ProgrammeStrategy = {
  id: string;
  title: string;
  body: string | null;
};

export type ProgrammeRelatedStory = {
  id: string;
  title: string;
  slug: string;
};

export type ProgrammeRelatedDownload = {
  id: string;
  title: string;
  href: string;
  byteSize?: number;
  fileType?: string;
};

export type ProgrammeListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  cover: ProgrammeImage | null;
};

/** Partner tool keys resolved from site settings (E14-01). */
export type ProgrammeExternalKey = "youthGoBudget" | "slogbaa";

export type ProgrammeDetail = ProgrammeListItem & {
  body: string | null;
  strategies: ProgrammeStrategy[];
  images: ProgrammeImage[];
  /** Keys only — URLs come from `getSiteSettings().externalServices`. */
  externalLinkKeys: ProgrammeExternalKey[];
  relatedStories: ProgrammeRelatedStory[];
  relatedDownloads: ProgrammeRelatedDownload[];
  linksToYouthSpaces: boolean;
};

function externalKeysForSlug(slug: string): ProgrammeExternalKey[] {
  return slug === "gap" ? ["youthGoBudget", "slogbaa"] : [];
}

function toCover(
  image:
    | {
        id: string;
        caption: string | null;
        media: {
          url: string;
          altText: string | null;
          thumbUrl?: string | null;
          mediumUrl?: string | null;
        };
      }
    | undefined,
  title: string,
): ProgrammeImage | null {
  if (!image) return null;
  return {
    id: image.id,
    caption: image.caption,
    url: mediaVariantUrl(image.media, "medium"),
    altText: image.media.altText?.trim() || image.caption?.trim() || title,
  };
}

export async function listProgrammes(): Promise<ProgrammeListItem[]> {
  const rows = await listPublishedProgrammes();
  return rows.map((programme) => ({
    id: programme.id,
    title: programme.title,
    slug: programme.slug,
    summary: programme.summary,
    cover: toCover(programme.images[0], programme.title),
  }));
}

export async function getProgrammeBySlug(
  slug: string,
): Promise<ProgrammeDetail | null> {
  const programme = await getPublishedProgrammeBySlug(slug);
  if (!programme) return null;

  const images = programme.images.map((image) => ({
    id: image.id,
    caption: image.caption,
    url: mediaVariantUrl(image.media, "medium"),
    altText:
      image.media.altText?.trim() ||
      image.caption?.trim() ||
      programme.title,
  }));

  return {
    id: programme.id,
    title: programme.title,
    slug: programme.slug,
    summary: programme.summary,
    cover: images[0] ?? null,
    body: programme.body?.trim() || null,
    strategies: programme.strategies.map((strategy) => ({
      id: strategy.id,
      title: strategy.title,
      body: strategy.body,
    })),
    images,
    externalLinkKeys: externalKeysForSlug(programme.slug),
    relatedStories: [],
    relatedDownloads: [],
    linksToYouthSpaces: programme.slug === "youth-organizing",
  };
}

/** Nav children driven by published programmes. */
export async function programmeNavLinks(): Promise<
  { label: string; href: string }[]
> {
  const programmes = await listProgrammes();
  return [
    { label: "All programmes", href: "/programs" },
    ...programmes.map((programme) => ({
      label: programme.title,
      href: `/programs/${programme.slug}`,
    })),
  ];
}
