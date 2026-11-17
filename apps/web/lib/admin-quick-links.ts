import type { AdminNavIcon } from "./admin-nav";

export type AdminQuickLink = {
  href: string;
  label: string;
  icon: AdminNavIcon;
};

/** Primary create shortcuts — keep short for a dense dashboard. */
export const ADMIN_QUICK_LINKS: AdminQuickLink[] = [
  { href: "/admin/articles/new", label: "Article", icon: "articles" },
  { href: "/admin/events/new", label: "Event", icon: "events" },
  { href: "/admin/opportunities/new", label: "Opportunity", icon: "opportunities" },
  { href: "/admin/documents/new", label: "Download", icon: "downloads" },
  { href: "/admin/albums/new", label: "Album", icon: "albums" },
  { href: "/admin/videos/new", label: "Video", icon: "videos" },
  { href: "/admin/team/new", label: "Team", icon: "team" },
  { href: "/admin/partners/new", label: "Partner", icon: "partners" },
];
