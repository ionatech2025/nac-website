/**
 * Seed opportunities for Epic E8 until CMS publish helpers are wired.
 * Dates are YYYY-MM-DD (date-only, Africa/Kampala end-of-day rules).
 */

export type SeedOpportunityType = {
  id: string;
  name: string;
  slug: string;
};

export type SeedAttachment = {
  id: string;
  title: string;
  href: string;
  fileName: string;
  byteSize?: number;
};

export type SeedOpportunity = {
  id: string;
  title: string;
  slug: string;
  typeSlug: string | null;
  description: string;
  openingDate: string | null;
  closingDate: string | null;
  contactEmail: string;
  contactPhone: string | null;
  applicationInstructions: string | null;
  manualStatus: "NONE" | "CLOSED" | "ARCHIVED";
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  attachments: SeedAttachment[];
};

export const SEED_OPPORTUNITY_TYPES: SeedOpportunityType[] = [
  { id: "type-call", name: "Call for interest", slug: "call-for-interest" },
  { id: "type-membership", name: "Membership", slug: "membership" },
  { id: "type-job", name: "Job", slug: "job" },
  { id: "type-fellowship", name: "Fellowship", slug: "fellowship" },
  { id: "type-volunteer", name: "Volunteer", slug: "volunteer" },
];

const PLAN_PDF =
  "https://nacuganda.org/sites/default/files/Downloads/NAC_Strategic%20Plan.pdf";

export const SEED_OPPORTUNITIES: SeedOpportunity[] = [
  {
    id: "opp-1",
    title: "Youth Connect – Inclusive Economic Empowerment Pathway",
    slug: "youth-connect-iee",
    typeSlug: "call-for-interest",
    description:
      "Call for expressions of interest for youth-led and youth-focused organisations working in Kampala’s informal settlements.",
    openingDate: "2025-10-01",
    closingDate: "2026-12-31",
    contactEmail: "activecitizenuganda@gmail.com",
    contactPhone: "+256 774 843 081",
    applicationInstructions:
      "Email a short organisational profile and why you want to join the pathway. Attach supporting documents as PDFs.",
    manualStatus: "NONE",
    status: "PUBLISHED",
    attachments: [
      {
        id: "att-1",
        title: "NAC Strategic Plan 2024–2028",
        href: PLAN_PDF,
        fileName: "NAC_Strategic_Plan.pdf",
        byteSize: 2_400_000,
      },
    ],
  },
  {
    id: "opp-2",
    title: "JOIN THE MOVEMENT – Membership call",
    slug: "membership-call",
    typeSlug: "membership",
    description:
      "Registered youth-led CBOs and NGOs are invited to join the NAC membership network.",
    openingDate: "2025-09-01",
    closingDate: "2026-11-30",
    contactEmail: "activecitizenuganda@gmail.com",
    contactPhone: null,
    applicationInstructions:
      "Send your organisation’s registration details and a brief note on your community focus.",
    manualStatus: "NONE",
    status: "PUBLISHED",
    attachments: [],
  },
  {
    id: "opp-3",
    title: "Programme Officer – Governance and Participation",
    slug: "programme-officer-gap",
    typeSlug: "job",
    description:
      "Support GAP partners with youth budgeting tools and leadership training across the network.",
    openingDate: "2026-01-15",
    closingDate: "2026-06-30",
    contactEmail: "activecitizenuganda@gmail.com",
    contactPhone: "+256 (0) 393 216240",
    applicationInstructions:
      "Send a CV and one-page cover letter. Put the role title in your email subject.",
    manualStatus: "NONE",
    status: "PUBLISHED",
    attachments: [],
  },
  {
    id: "opp-4",
    title: "Community Journalism Fellowship 2025",
    slug: "community-journalism-fellowship-2025",
    typeSlug: "fellowship",
    description:
      "A fellowship for young reporters documenting neighbourhood priorities for duty bearers.",
    openingDate: "2025-01-10",
    closingDate: "2025-03-31",
    contactEmail: "activecitizenuganda@gmail.com",
    contactPhone: null,
    applicationInstructions: "Applications for this round are closed.",
    manualStatus: "NONE",
    status: "PUBLISHED",
    attachments: [],
  },
  {
    id: "opp-5",
    title: "Youth Climate Resilience volunteer cohort",
    slug: "ycr-volunteer-cohort",
    typeSlug: "volunteer",
    description:
      "Volunteer with YCR partners on community risk mapping walks in flood-prone settlements.",
    openingDate: "2025-11-01",
    closingDate: "2026-09-30",
    contactEmail: "activecitizenuganda@gmail.com",
    contactPhone: "+256 701 840 078",
    applicationInstructions:
      "Email your availability and any prior community organising experience.",
    manualStatus: "NONE",
    status: "PUBLISHED",
    attachments: [],
  },
  {
    id: "opp-6",
    title: "West Nile digital storytelling fellowship",
    slug: "west-nile-digital-storytelling",
    typeSlug: "fellowship",
    description:
      "Peer-learning fellowship with Arua Youth Space and regional media partners.",
    openingDate: "2025-06-01",
    closingDate: "2026-08-15",
    contactEmail: "activecitizenuganda@gmail.com",
    contactPhone: null,
    applicationInstructions: null,
    manualStatus: "CLOSED",
    status: "PUBLISHED",
    attachments: [
      {
        id: "att-2",
        title: "Programme overview (PDF)",
        href: PLAN_PDF,
        fileName: "programme-overview.pdf",
        byteSize: 1_200_000,
      },
    ],
  },
];
