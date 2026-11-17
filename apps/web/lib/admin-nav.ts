export type AdminNavIcon =
  | "dashboard"
  | "articles"
  | "downloads"
  | "opportunities"
  | "events"
  | "albums"
  | "videos"
  | "slideshow"
  | "featured"
  | "partners"
  | "team"
  | "programmes"
  | "youthSpaces"
  | "about"
  | "figures"
  | "settings"
  | "inquiries"
  | "complaints"
  | "help";

export type AdminNavLink = {
  href: string;
  label: string;
  icon: AdminNavIcon;
};

export type AdminNavGroup = {
  label: string;
  links: AdminNavLink[];
};

/** Grouped sidebar navigation for the admin shell. */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }],
  },
  {
    label: "Publishing",
    links: [
      { href: "/admin/articles", label: "Articles", icon: "articles" },
      { href: "/admin/documents", label: "Downloads", icon: "downloads" },
      { href: "/admin/opportunities", label: "Opportunities", icon: "opportunities" },
      { href: "/admin/events", label: "Events", icon: "events" },
    ],
  },
  {
    label: "Media & home",
    links: [
      { href: "/admin/albums", label: "Albums", icon: "albums" },
      { href: "/admin/videos", label: "Videos", icon: "videos" },
      { href: "/admin/slideshow", label: "Slideshow", icon: "slideshow" },
      { href: "/admin/featured", label: "Featured", icon: "featured" },
      { href: "/admin/partners", label: "Partners", icon: "partners" },
    ],
  },
  {
    label: "Organisation",
    links: [
      { href: "/admin/team", label: "Team", icon: "team" },
      { href: "/admin/programmes", label: "Programmes", icon: "programmes" },
      { href: "/admin/youth-spaces", label: "Youth spaces", icon: "youthSpaces" },
      { href: "/admin/about", label: "About", icon: "about" },
      { href: "/admin/key-figures", label: "Key figures", icon: "figures" },
      { href: "/admin/settings", label: "Site settings", icon: "settings" },
    ],
  },
  {
    label: "Inbox",
    links: [
      { href: "/admin/inquiries", label: "Inquiries", icon: "inquiries" },
      { href: "/admin/complaints", label: "Complaints", icon: "complaints" },
    ],
  },
  {
    label: "Support",
    links: [{ href: "/admin/help", label: "Help & support", icon: "help" }],
  },
];

export const ADMIN_NAV_LINKS = ADMIN_NAV_GROUPS.flatMap((g) => g.links);
