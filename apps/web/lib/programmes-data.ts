/**
 * Programmes seed/fallback for Epic E5 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers later.
 * No database access from this module.
 */

export type ProgrammeImage = {
  id: string;
  caption: string | null;
  url: string;
  altText: string;
};

export type ProgrammeStrategy = {
  id: string;
  title: string;
  body: string | null;
};

export type ProgrammeRelatedStory = {
  id: string;
  title: string;
  slug: string;
};

export type ProgrammeRelatedDownload = {
  id: string;
  title: string;
  href: string;
  byteSize?: number;
  fileType?: string;
};

export type ProgrammeListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  cover: ProgrammeImage | null;
};

/** Partner tool keys resolved from site settings (E14-01). */
export type ProgrammeExternalKey = "youthGoBudget" | "slogbaa";

export type ProgrammeDetail = ProgrammeListItem & {
  body: string | null;
  strategies: ProgrammeStrategy[];
  images: ProgrammeImage[];
  /** Keys only — URLs come from `getSiteSettings().externalServices`. */
  externalLinkKeys: ProgrammeExternalKey[];
  relatedStories: ProgrammeRelatedStory[];
  relatedDownloads: ProgrammeRelatedDownload[];
  linksToYouthSpaces: boolean;
};

const seedProgrammes: ProgrammeDetail[] = [
  {
    id: "prog-gap",
    title: "Governance and Participation",
    slug: "gap",
    summary:
      "Empowerment training for leaders so they can influence change in the communities they represent.",
    cover: null,
    body:
      "GAP strengthens youth participation in governance and budgeting. NAC works with partners so young people can shape local decisions and hold duty bearers to account.",
    strategies: [
      {
        id: "gap-s1",
        title: "Leadership empowerment",
        body: "Train newly elected and community leaders for effective, inclusive leadership.",
      },
      {
        id: "gap-s2",
        title: "Youth budgeting tools",
        body: "Use Youth Go Budget and SLOGBAA to organise youth around fiscal processes.",
      },
    ],
    images: [],
    externalLinkKeys: ["youthGoBudget", "slogbaa"],
    relatedStories: [],
    relatedDownloads: [
      {
        id: "doc-youth-budgeting",
        title: "Youth budgeting quick start",
        href: "https://nacuganda.org/sites/default/files/Downloads/NAC_Strategic%20Plan.pdf",
        byteSize: 720_000,
        fileType: "PDF",
      },
      {
        id: "doc-strategic-plan",
        title: "NAC Strategic Plan 2024–2028",
        href: "https://nacuganda.org/sites/default/files/Downloads/NAC_Strategic%20Plan.pdf",
        byteSize: 2_400_000,
        fileType: "PDF",
      },
    ],
    linksToYouthSpaces: false,
  },
  {
    id: "prog-ycr",
    title: "Youth Climate Resilience",
    slug: "ycr",
    summary:
      "Urban sustainability initiatives with young people living in vulnerable communities.",
    cover: null,
    body:
      "YCR increases wellbeing and climate resilience through community-led urban sustainability work in Kampala’s vulnerable settlements.",
    strategies: [
      {
        id: "ycr-s1",
        title: "Community clean-ups and greening",
        body: "Support youth-led clean-ups and green spaces that reduce flood and waste risks.",
      },
      {
        id: "ycr-s2",
        title: "Climate awareness",
        body: "Build local knowledge so young people can advocate for safer neighbourhoods.",
      },
    ],
    images: [],
    externalLinkKeys: [],
    relatedStories: [],
    relatedDownloads: [],
    linksToYouthSpaces: false,
  },
  {
    id: "prog-cj",
    title: "Community Journalism",
    slug: "community-journalism",
    summary:
      "Putting community issues in front of duty bearers and stakeholders.",
    cover: null,
    body:
      "Community Journalism supports young people to document and amplify local issues so duty bearers and stakeholders can respond.",
    strategies: [
      {
        id: "cj-s1",
        title: "Storytelling skills",
        body: "Train youth reporters to capture community priorities accurately and safely.",
      },
      {
        id: "cj-s2",
        title: "Public amplification",
        body: "Share stories that put community concerns on the agenda of decision makers.",
      },
    ],
    images: [],
    externalLinkKeys: [],
    relatedStories: [],
    relatedDownloads: [],
    linksToYouthSpaces: false,
  },
  {
    id: "prog-yos",
    title: "Youth Organizing and Strengthening",
    slug: "youth-organizing",
    summary:
      "Organising and strengthening youth spaces and civil society pathways.",
    cover: null,
    body:
      "This programme builds capacity for youth organisations and the physical youth spaces where young people organise, learn, and lead.",
    strategies: [
      {
        id: "yos-s1",
        title: "Strengthen youth spaces",
        body: "Support spaces that offer organising, learning, and peer connection.",
      },
      {
        id: "yos-s2",
        title: "Organisational capacity",
        body: "Help youth-led groups grow skills for sustainable community work.",
      },
    ],
    images: [],
    externalLinkKeys: [],
    relatedStories: [],
    relatedDownloads: [],
    linksToYouthSpaces: true,
  },
];

export async function listProgrammes(): Promise<ProgrammeListItem[]> {
  return seedProgrammes.map(
    ({ id, title, slug, summary, cover }) => ({
      id,
      title,
      slug,
      summary,
      cover,
    }),
  );
}

export async function getProgrammeBySlug(
  slug: string,
): Promise<ProgrammeDetail | null> {
  return seedProgrammes.find((programme) => programme.slug === slug) ?? null;
}

/** Nav children driven by the same seed list (CMS-ready shape). */
export function programmeNavLinks(): { label: string; href: string }[] {
  return [
    { label: "All programs", href: "/programs" },
    ...seedProgrammes.map((programme) => ({
      label: programme.title,
      href: `/programs/${programme.slug}`,
    })),
  ];
}
