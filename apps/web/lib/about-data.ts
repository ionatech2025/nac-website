/**
 * About Us seed/fallback for Epic E3 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers when wiring CMS reads.
 * No database access from this module.
 */

export type AboutMedia = {
  url: string;
  altText: string | null;
  thumbUrl?: string | null;
  mediumUrl?: string | null;
  width?: number | null;
  height?: number | null;
};

export type AboutImage = {
  id: string;
  caption: string | null;
  media: AboutMedia;
};

export type AboutPageContent = {
  title: string;
  mission: string;
  vision: string;
  whatWeDo: string;
  why: string;
  images: AboutImage[];
};

export type AboutFigure = {
  id: string;
  label: string;
  value: string;
};

export type AboutProgramme = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
};

const seedAbout: AboutPageContent = {
  title: "About us",
  mission:
    "To build youth resilience in Uganda through capability development and policy outreach.",
  vision: "A resilient and prosperous Uganda.",
  whatWeDo:
    "Founded in 2017, Network for Active Citizens (NAC) brings together grassroots, youth-led and refugee-led organisations. We create spaces for young people to connect, identify shared priorities, and access resources so they can lead the development change they want in their communities.",
  why:
    "Young people need organised platforms to influence governance, climate resilience, and community wellbeing. NAC exists so youth organisations can work together with strength and clarity.",
  images: [],
};

const seedFigures: AboutFigure[] = [
  { id: "fig-orgs", label: "Organisations in the network", value: "89+" },
  { id: "fig-spaces", label: "Youth spaces", value: "15" },
];

const seedProgrammes: AboutProgramme[] = [
  {
    id: "prog-gap",
    title: "Governance and Participation",
    slug: "gap",
    summary:
      "Empowerment training for leaders so they can influence change in the communities they represent.",
    body:
      "GAP strengthens youth participation in governance and budgeting processes, including tools such as Youth Go Budget and SLOGBAA.",
  },
  {
    id: "prog-ycr",
    title: "Youth Climate Resilience",
    slug: "ycr",
    summary:
      "Urban sustainability initiatives with young people living in vulnerable communities.",
    body:
      "YCR increases wellbeing and climate resilience through community-led urban sustainability work.",
  },
  {
    id: "prog-cj",
    title: "Community Journalism",
    slug: "community-journalism",
    summary:
      "Putting community issues in front of duty bearers and stakeholders.",
    body:
      "Community Journalism supports young people to document and amplify local issues for accountability.",
  },
  {
    id: "prog-yos",
    title: "Youth Organizing and Strengthening",
    slug: "youth-organizing",
    summary:
      "Organising and strengthening youth spaces and civil society pathways.",
    body:
      "This programme builds capacity for youth organisations and the spaces where young people organise.",
  },
];

export async function getAboutPageContent(): Promise<AboutPageContent> {
  return seedAbout;
}

export async function getAboutKeyFigures(): Promise<AboutFigure[]> {
  return seedFigures;
}

export async function getAboutProgrammes(): Promise<AboutProgramme[]> {
  return seedProgrammes;
}

export async function getAboutProgrammeBySlug(
  slug: string,
): Promise<AboutProgramme | null> {
  return seedProgrammes.find((programme) => programme.slug === slug) ?? null;
}

export function aboutImageSrc(media: AboutMedia): string {
  return media.mediumUrl ?? media.thumbUrl ?? media.url;
}
