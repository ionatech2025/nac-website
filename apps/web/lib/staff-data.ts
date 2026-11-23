/**
 * Staff directory seed/fallback for Epic E4 (Dev A).
 * Matches `listPublishedTeamMembers` shape; swap to @repo/database later.
 * No database access. Biographies only when NAC has supplied them — never invented.
 */

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

/** Seed list in admin-style order. Bios omitted unless NAC supplied them. */
const seedStaff: StaffMember[] = [
  {
    id: "staff-1",
    name: "Peniel Rwendeire",
    roleTitle: "Executive Director",
    biography: null,
    photo: null,
  },
  {
    id: "staff-2",
    name: "Patricia Nakitto",
    roleTitle: "Programme lead",
    biography: null,
    photo: null,
  },
];

export async function listStaffMembers(): Promise<StaffMember[]> {
  return seedStaff;
}

export function staffPhotoSrc(photo: StaffPhoto | null): string | null {
  if (!photo) return null;
  return photo.mediumUrl ?? photo.thumbUrl ?? photo.url;
}

export function staffInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
