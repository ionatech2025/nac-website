import { programmeNavLinks } from "./programmes-data";
import {
  youthSpacesNavColumns,
  youthSpacesNavLinks,
  type YouthSpacesNavColumn,
} from "./youth-spaces-data";

export type NavLink = {
  label: string;
  href: string;
};

export type NavColumn = YouthSpacesNavColumn;

export type NavItem =
  | { type: "link"; label: string; href: string }
  | {
      type: "group";
      label: string;
      href: string;
      children: NavLink[];
      /** Desktop mega-style row instead of a tall vertical menu. */
      layout?: "vertical" | "horizontal";
      /** Optional region columns (Youth Spaces mega menu). */
      columns?: NavColumn[];
    };

/**
 * Primary navigation. Member organisations live under About Us;
 * Contact Us dropdown covers inquiries and complaints (no extra Contact CTA).
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
  {
    type: "group",
    label: "Youth Spaces",
    href: "/youth-spaces",
    layout: "horizontal",
    children: youthSpacesNavLinks(),
    columns: youthSpacesNavColumns(),
  },
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
