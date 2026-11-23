/**
 * Seed events for Epic E9 until CMS publish helpers are wired.
 * Times are Africa/Kampala (+03:00).
 */

export type SeedEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  registrationUrl: string | null;
  contact: string | null;
  status: "PUBLISHED" | "CANCELLED" | "DRAFT" | "ARCHIVED";
};

const BANNER =
  "https://nacuganda.org/sites/default/files/styles/banner_image/public/Banner%20Images/IMG_8729_optimized_1.jpeg";

export const SEED_EVENTS: SeedEvent[] = [
  {
    id: "evt-1",
    title: "Annual Partners Forum 2026",
    slug: "annual-partners-forum-2026",
    description:
      "A day for NAC member organisations to share priorities, partnerships and plans for the year ahead.",
    startAt: "2026-12-05T09:00:00+03:00",
    endAt: "2026-12-05T16:30:00+03:00",
    timezone: "Africa/Kampala",
    location: "Kisaasi Youth Space, Kampala",
    imageUrl: BANNER,
    imageAlt: "Partners gathered at a NAC forum",
    registrationUrl: "https://nacuganda.org/contact",
    contact: "activecitizenuganda@gmail.com",
    status: "PUBLISHED",
  },
  {
    id: "evt-2",
    title: "Youth CSO Market",
    slug: "youth-cso-market-2026",
    description:
      "Showcase of youth-led groups, services and partnerships at the annual Youth CSO Market.",
    startAt: "2026-12-12T10:00:00+03:00",
    endAt: "2026-12-12T17:00:00+03:00",
    timezone: "Africa/Kampala",
    location: "Kisaasi Youth Space, Kampala",
    imageUrl: BANNER,
    imageAlt: "Youth CSO Market gathering",
    registrationUrl: null,
    contact: "+256 774 843 081",
    status: "PUBLISHED",
  },
  {
    id: "evt-3",
    title: "West Nile digital storytelling workshop",
    slug: "west-nile-storytelling-workshop",
    description:
      "Hands-on workshop with Arua Youth Space and regional media partners for young storytellers.",
    startAt: "2027-01-20T09:30:00+03:00",
    endAt: "2027-01-21T15:00:00+03:00",
    timezone: "Africa/Kampala",
    location: "Arua Youth Space, Arua",
    imageUrl: null,
    imageAlt: null,
    registrationUrl: "https://nacuganda.org/contact",
    contact: "activecitizenuganda@gmail.com",
    status: "PUBLISHED",
  },
  {
    id: "evt-4",
    title: "Climate resilience community walk",
    slug: "climate-resilience-walk-kampala",
    description:
      "Community walk mapping flood risk with Youth Climate Resilience partners in Kampala settlements.",
    startAt: "2026-12-02T08:00:00+03:00",
    endAt: "2026-12-02T12:00:00+03:00",
    timezone: "Africa/Kampala",
    location: "Kinawataka, Kampala",
    imageUrl: null,
    imageAlt: null,
    registrationUrl: null,
    contact: null,
    status: "CANCELLED",
  },
  {
    id: "evt-5",
    title: "GAP youth budgeting clinic",
    slug: "gap-youth-budgeting-clinic",
    description:
      "Clinic introducing Youth Go Budget and SLOGBAA for member organisers.",
    startAt: "2026-10-18T09:00:00+03:00",
    endAt: "2026-10-18T13:00:00+03:00",
    timezone: "Africa/Kampala",
    location: "Shaniela Courts, Kampala",
    imageUrl: BANNER,
    imageAlt: "Youth budgeting clinic session",
    registrationUrl: null,
    contact: "activecitizenuganda@gmail.com",
    status: "PUBLISHED",
  },
  {
    id: "evt-6",
    title: "Mayuge resource centre launch",
    slug: "mayuge-resource-centre-launch",
    description:
      "Launch of the community library and resource centre at Mayuge Youth CSO Space.",
    startAt: "2025-05-20T10:00:00+03:00",
    endAt: "2025-05-20T14:00:00+03:00",
    timezone: "Africa/Kampala",
    location: "Mayuge Youth CSO Space",
    imageUrl: null,
    imageAlt: null,
    registrationUrl: null,
    contact: null,
    status: "PUBLISHED",
  },
  {
    id: "evt-7",
    title: "Membership orientation day",
    slug: "membership-orientation-day",
    description:
      "Orientation for newly joining youth-led organisations in the NAC network.",
    startAt: "2026-09-12T09:00:00+03:00",
    endAt: "2026-09-12T15:00:00+03:00",
    timezone: "Africa/Kampala",
    location: "Kisaasi Youth Space, Kampala",
    imageUrl: BANNER,
    imageAlt: "Membership orientation gathering",
    registrationUrl: null,
    contact: "activecitizenuganda@gmail.com",
    status: "PUBLISHED",
  },
];
