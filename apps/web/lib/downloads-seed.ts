/**
 * Seed documents for Epic E11 until CMS publish helpers are wired.
 * Seed `downloadPath` uses stable public file URLs so downloads work without DB;
 * CMS will use `/downloads/<documentId>` via documentDownloadPath.
 */

export type SeedCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export type SeedDocument = {
  id: string;
  title: string;
  description: string | null;
  categorySlug: string | null;
  fileType: string;
  byteSize: number;
  publishedAt: string;
  downloadPath: string;
  fileName: string;
};

const PLAN =
  "https://nacuganda.org/sites/default/files/Downloads/NAC_Strategic%20Plan.pdf";

export const SEED_CATEGORIES: SeedCategory[] = [
  { id: "cat-plans", name: "Strategic plans", slug: "strategic-plans", sortOrder: 0 },
  { id: "cat-reports", name: "Reports", slug: "reports", sortOrder: 1 },
  { id: "cat-guides", name: "Guides", slug: "guides", sortOrder: 2 },
  { id: "cat-forms", name: "Forms", slug: "forms", sortOrder: 3 },
];

export const SEED_DOCUMENTS: SeedDocument[] = [
  {
    id: "doc-strategic-plan",
    title: "NAC Strategic Plan 2024–2028",
    description:
      "Priorities for capability development, policy outreach and youth spaces across the network.",
    categorySlug: "strategic-plans",
    fileType: "PDF",
    byteSize: 2_400_000,
    publishedAt: "2025-03-15T08:00:00.000Z",
    downloadPath: PLAN,
    fileName: "NAC_Strategic_Plan.pdf",
  },
  {
    id: "doc-annual-highlights",
    title: "Annual highlights 2025",
    description:
      "A short overview of network activity, youth spaces and partner milestones from the year.",
    categorySlug: "reports",
    fileType: "PDF",
    byteSize: 1_850_000,
    publishedAt: "2025-12-01T08:00:00.000Z",
    downloadPath: PLAN,
    fileName: "NAC_Annual_Highlights_2025.pdf",
  },
  {
    id: "doc-membership-guide",
    title: "Membership orientation guide",
    description:
      "How youth-led organisations join the network and use shared spaces and platforms.",
    categorySlug: "guides",
    fileType: "PDF",
    byteSize: 980_000,
    publishedAt: "2025-09-10T08:00:00.000Z",
    downloadPath: PLAN,
    fileName: "Membership_Orientation_Guide.pdf",
  },
  {
    id: "doc-youth-budgeting",
    title: "Youth budgeting quick start",
    description:
      "A short guide to Youth Go Budget and SLOGBAA for GAP partners and organisers.",
    categorySlug: "guides",
    fileType: "PDF",
    byteSize: 720_000,
    publishedAt: "2025-08-05T08:00:00.000Z",
    downloadPath: PLAN,
    fileName: "Youth_Budgeting_Quick_Start.pdf",
  },
  {
    id: "doc-expression-interest",
    title: "Expression of interest form template",
    description:
      "Template organisations can adapt when responding to open calls from NAC.",
    categorySlug: "forms",
    fileType: "PDF",
    byteSize: 410_000,
    publishedAt: "2025-10-20T08:00:00.000Z",
    downloadPath: PLAN,
    fileName: "Expression_of_Interest_Template.pdf",
  },
  {
    id: "doc-climate-brief",
    title: "Youth climate resilience brief",
    description:
      "Summary of community risk-mapping walks and adaptation priorities with YCR partners.",
    categorySlug: "reports",
    fileType: "PDF",
    byteSize: 1_250_000,
    publishedAt: "2025-06-18T08:00:00.000Z",
    downloadPath: PLAN,
    fileName: "Youth_Climate_Resilience_Brief.pdf",
  },
  {
    id: "doc-spaces-overview",
    title: "Youth spaces overview",
    description:
      "Overview of physical youth spaces by region for partners and visitors.",
    categorySlug: "guides",
    fileType: "PDF",
    byteSize: 1_100_000,
    publishedAt: "2025-04-02T08:00:00.000Z",
    downloadPath: PLAN,
    fileName: "Youth_Spaces_Overview.pdf",
  },
];
