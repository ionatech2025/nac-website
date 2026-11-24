/**
 * Member organisations seed/fallback for Epic E16 (Dev A).
 * Swap to listPublishedMemberOrganisations / getPublished…BySlug later.
 */

import {
  SEED_MEMBER_ORGANISATIONS,
  type SeedMemberImage,
  type SeedMemberOrganisation,
} from "./member-organisations-seed";

export type MemberOrgImage = SeedMemberImage;

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

function toListItem(row: SeedMemberOrganisation): MemberOrganisationListItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio,
    excerpt: bioExcerpt(row.bio),
    websiteUrl: row.websiteUrl,
    cover: row.images[0] ?? null,
  };
}

function toDetail(row: SeedMemberOrganisation): MemberOrganisationDetail {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    bio: row.bio,
    websiteUrl: row.websiteUrl,
    images: row.images.slice(0, 3),
  };
}

const published = [...SEED_MEMBER_ORGANISATIONS].sort(
  (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
);

export async function listMemberOrganisations(): Promise<
  MemberOrganisationListItem[]
> {
  return published.map(toListItem);
}

export async function getMemberOrganisationBySlug(
  slug: string,
): Promise<MemberOrganisationDetail | null> {
  const row = published.find((item) => item.slug === slug);
  return row ? toDetail(row) : null;
}
