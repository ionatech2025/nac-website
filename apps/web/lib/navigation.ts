import { programmeNavLinks } from "./programmes-data";

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "group"; label: string; href: string; children: NavLink[] };

/** Primary navigation from requirements §5.1; Programs children from seed/CMS list. */
export const primaryNav: NavItem[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "link", label: "About Us", href: "/about" },
  { type: "link", label: "Our Staff", href: "/staff" },
  {
    type: "link",
    label: "Member organisations",
    href: "/member-organisations",
  },
  {
    type: "group",
    label: "Programs",
    href: "/programs",
    children: programmeNavLinks(),
  },
  { type: "link", label: "Youth Spaces", href: "/youth-spaces" },
  { type: "link", label: "Opportunities", href: "/opportunities" },
  { type: "link", label: "Events", href: "/events" },
  {
    type: "group",
    label: "Galleries",
    href: "/galleries",
    children: [
      { label: "Photo Gallery", href: "/galleries/photos" },
      { label: "Video Gallery", href: "/galleries/videos" },
    ],
  },
  { type: "link", label: "Blogs & News", href: "/news" },
  { type: "link", label: "Downloads", href: "/downloads" },
  {
    type: "group",
    label: "Contact Us",
    href: "/contact",
    children: [
      { label: "Inquiries", href: "/contact" },
      { label: "Complaints", href: "/complaints" },
    ],
  },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
