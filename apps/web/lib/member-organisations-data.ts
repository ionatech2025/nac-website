/**
 * Member organisations (E16) — published orgs from `@repo/database`.
 */

import {
  getPublishedMemberOrganisationBySlug,
  listPublishedMemberOrganisations,
  mediaVariantUrl,
} from "@repo/database";

export type MemberOrgImage = {
  id: string;
  caption: string | null;
  url: string;
  altText: string;
};

export type MemberOrganisationListItem = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  excerpt: string;
  websiteUrl: string | null;
  cover: MemberOrgImage | null;
};

export type MemberOrganisationDetail = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  websiteUrl: string | null;
  images: MemberOrgImage[];
};

/** Short plain excerpt for listing cards (E16-01). */
export function bioExcerpt(bio: string, max = 160): string {
  const plain = bio.replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  const slice = plain.slice(0, max);
  const cut = slice.lastIndexOf(" ");
  return `${(cut > 80 ? slice.slice(0, cut) : slice).trim()}…`;
}

function toImage(
  image: {
    id: string;
    caption: string | null;
    media: {
      url: string;
      altText: string | null;
      thumbUrl?: string | null;
      mediumUrl?: string | null;
    };
  },
  orgName: string,
): MemberOrgImage {
  return {
    id: image.id,
    caption: image.caption,
    url: mediaVariantUrl(image.media, "medium"),
    altText:
      image.media.altText?.trim() || image.caption?.trim() || orgName,
  };
}

export async function listMemberOrganisations(): Promise<
  MemberOrganisationListItem[]
> {
  const rows = await listPublishedMemberOrganisations();
  return rows.map((row) => {
    const cover = row.images[0] ? toImage(row.images[0], row.name) : null;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      bio: row.bio,
      excerpt: bioExcerpt(row.bio),
      websiteUrl: row.websiteUrl?.trim() || null,
      cover,
    };
  });
}

export async function getMemberOrganisationBySlug(
  slug: string,
): Promise<MemberOrganisationDetail | null> {
  const row = await getPublishedMemberOrganisationBySlug(slug);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio,
    websiteUrl: row.websiteUrl?.trim() || null,
    images: row.images.slice(0, 3).map((image) => toImage(image, row.name)),
  };
}
