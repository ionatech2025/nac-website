/**
 * Staff directory (E04) — published team members from `@repo/database`.
 */

import {
  listPublishedTeamMembers,
  mediaVariantUrl,
} from "@repo/database";

export type StaffPhoto = {
  url: string;
  altText: string | null;
  thumbUrl?: string | null;
  mediumUrl?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StaffMember = {
  id: string;
  name: string;
  roleTitle: string;
  biography: string | null;
  photo: StaffPhoto | null;
};

export async function listStaffMembers(): Promise<StaffMember[]> {
  const rows = await listPublishedTeamMembers();
  return rows.map((member) => ({
    id: member.id,
    name: member.name,
    roleTitle: member.roleTitle,
    biography: member.biography?.trim() || null,
    photo: member.photo
      ? {
          url: member.photo.url,
          altText: member.photo.altText,
          thumbUrl: member.photo.thumbUrl,
          mediumUrl: member.photo.mediumUrl,
          width: member.photo.width,
          height: member.photo.height,
        }
      : null,
  }));
}

export function staffPhotoSrc(photo: StaffPhoto | null): string | null {
  if (!photo) return null;
  return mediaVariantUrl(photo, "medium");
}

export function staffInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
