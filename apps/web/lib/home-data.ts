/**
 * Homepage content for Epic E2.
 * Seed/fallback until Dev B publishes typed data-access queries.
 */

import {
  listLatestDocuments,
  toLatestDownloadItem,
} from "./downloads-data";

export type HomeIdentity = {
  orgName: string;
  tagline: string;
  mission: string;
  vision: string;
};

export type SlideshowSlide = {
  id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  destinationUrl?: string;
};

export type HomeStory = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type HomeVideo = {
  id: string;
  title: string;
  description?: string;
  provider: "YOUTUBE" | "VIMEO";
  url: string;
};

export type FeaturedConceptItem = {
  id: string;
  title: string;
  summary?: string;
  destinationUrl?: string;
};

export type PartnerItem = {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
};

export type KeyFigureItem = {
  id: string;
  label: string;
  value: string;
};

export type HomeDownload = {
  id: string;
  title: string;
  href: string;
  byteSize?: number;
  fileType?: string;
};

export type HomePageData = {
  identity: HomeIdentity;
  slides: SlideshowSlide[];
  stories: HomeStory[];
  videos: HomeVideo[];
  featuredConcepts: FeaturedConceptItem[];
  partners: PartnerItem[];
  keyFigures: KeyFigureItem[];
  downloads: HomeDownload[];
  youthGoBudgetUrl: string;
};

const seed: HomePageData = {
  identity: {
    orgName: "Network for Active Citizens",
    tagline: "Locally Engaged, Globally Connected",
    mission:
      "To build youth resilience in Uganda through capability development and policy outreach.",
    vision: "A resilient and prosperous Uganda",
  },
  slides: [
    {
      id: "slide-1",
      imageUrl:
        "https://nacuganda.org/sites/default/files/styles/banner_image/public/Banner%20Images/IMG_8729_optimized_1.jpeg",
      altText: "Young people gathered with NAC at a community event",
      caption: "Youth organizing across Uganda",
    },
    {
      id: "slide-2",
      imageUrl:
        "https://nacuganda.org/sites/default/files/styles/banner_image/public/Banner%20Images/IMG_8729_optimized_1.jpeg",
      altText: "NAC youth space and community engagement",
      caption: "Spaces where young people lead",
      destinationUrl: "/youth-spaces",
    },
  ],
  stories: [
    {
      id: "story-1",
      title: "Youth Connect – Inclusive Economic Empowerment Pathway",
      slug: "youth-connect-iee",
      excerpt:
        "Call for expressions of interest for youth-led and youth-focused organisations in Kampala’s informal settlements.",
    },
    {
      id: "story-2",
      title: "JOIN THE MOVEMENT – Membership call",
      slug: "membership-call",
      excerpt:
        "NAC is calling on registered youth-led CBOs and NGOs ready to shape community change.",
    },
  ],
  videos: [],
  featuredConcepts: [
    {
      id: "concept-1",
      title: "Governance and Participation",
      summary: "Equipping leaders to influence change in their communities.",
      destinationUrl: "/programs",
    },
    {
      id: "concept-2",
      title: "Youth Climate Resilience",
      summary: "Urban sustainability with young people in vulnerable settlements.",
      destinationUrl: "/programs",
    },
    {
      id: "concept-3",
      title: "Community Journalism",
      summary: "Bringing community issues to duty bearers and stakeholders.",
      destinationUrl: "/programs",
    },
  ],
  partners: [
    { id: "partner-1", name: "Partner organisation", websiteUrl: "https://slogbaa.org" },
    { id: "partner-2", name: "Youth network ally" },
  ],
  keyFigures: [
    { id: "fig-1", label: "Organisations in the network", value: "89+" },
    { id: "fig-2", label: "Youth spaces", value: "15" },
  ],
  downloads: [],
  youthGoBudgetUrl: "https://youthgobudgetapp.org",
};

export async function getHomePageData(): Promise<HomePageData> {
  const latest = await listLatestDocuments(4);
  return {
    ...seed,
    downloads: latest.map(toLatestDownloadItem),
  };
}
