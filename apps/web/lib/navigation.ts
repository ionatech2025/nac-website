import { programmeNavLinks } from "./programmes-data";

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "group"; label: string; href: string; children: NavLink[] };

/**
 * Primary navigation. Member organisations sit under About to keep the
 * desktop bar from overcrowding Contact Us.
 */
export const primaryNav: NavItem[] = [
  { type: "link", label: "Home", href: "/" },
  {
    type: "group",
    label: "About Us",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Staff", href: "/staff" },
      { label: "Member organisations", href: "/member-organisations" },
    ],
  },
  {
    type: "group",
    label: "Programmes",
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

/**
 * Active-state helper. Use `exact` for index links that share a prefix with
 * child routes (e.g. /programs vs /programs/gap).
 */
export function isNavActive(
  pathname: string,
  href: string,
  options?: { exact?: boolean },
): boolean {
  if (href === "/") return pathname === "/";
  if (options?.exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
