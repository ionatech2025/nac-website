/** Seed articles for Epic E7 until CMS publish helpers are wired. */

export type SeedArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  author: string | null;
  publishedAt: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
};

const BANNER =
  "https://nacuganda.org/sites/default/files/styles/banner_image/public/Banner%20Images/IMG_8729_optimized_1.jpeg";

type Draft = Omit<
  SeedArticle,
  "coverImageUrl" | "coverImageAlt" | "seoTitle" | "seoDescription" | "ogImageUrl"
> & { cover?: boolean; seoTitle?: string | null; seoDescription?: string | null };

function article(partial: Draft): SeedArticle {
  return {
    ...partial,
    coverImageUrl: partial.cover ? BANNER : null,
    coverImageAlt: partial.cover ? partial.title : null,
    seoTitle: partial.seoTitle ?? null,
    seoDescription: partial.seoDescription ?? null,
    ogImageUrl: partial.cover && partial.seoTitle ? BANNER : null,
  };
}

export const SEED_ARTICLES: SeedArticle[] = [
  article({
    id: "art-1",
    title: "Youth Connect – Inclusive Economic Empowerment Pathway",
    slug: "youth-connect-iee",
    excerpt:
      "Call for expressions of interest for youth-led organisations in Kampala’s informal settlements.",
    body: `NAC invites youth-led organisations in Kampala’s informal settlements to join the Youth Connect pathway.

## What it offers

- Capability development for grassroots organisers
- Peer learning across the network
- Support for inclusive economic opportunities`,
    author: "NAC Communications",
    publishedAt: "2025-11-10T08:00:00.000Z",
    cover: true,
    seoTitle: "Youth Connect IEE pathway — call for interest",
    seoDescription:
      "Express interest in NAC’s Youth Connect Inclusive Economic Empowerment pathway.",
  }),
  article({
    id: "art-2",
    title: "JOIN THE MOVEMENT – Membership call",
    slug: "membership-call",
    excerpt:
      "NAC is calling on registered youth-led CBOs and NGOs ready to shape community change.",
    body: `NAC invites registered youth-led community organisations and NGOs to join the membership network.

Members gain shared spaces, peer learning, and collective advocacy platforms across Uganda.`,
    author: null,
    publishedAt: "2025-10-22T08:00:00.000Z",
    cover: true,
  }),
  article({
    id: "art-3",
    title: "Youth CSO Market brings organisers together in Kampala",
    slug: "youth-cso-market-kampala",
    excerpt:
      "More than 30 youth-led groups shared ideas and partnerships at the annual Youth CSO Market.",
    body: `The Youth CSO Market at Kisaasi Youth Space brought together youth-led groups from across Kampala to share programmes and build partnerships.`,
    author: "NAC Communications",
    publishedAt: "2025-09-15T08:00:00.000Z",
    cover: true,
  }),
  article({
    id: "art-4",
    title: "West Nile hubs advance digital storytelling",
    slug: "west-nile-digital-storytelling",
    excerpt:
      "Arua Youth Space partners with regional media on digital storytelling fellowships.",
    body: `Young creators in West Nile are building digital storytelling skills through Arua Youth Space and regional media partnerships, including the Next Creata Fellowship.`,
    author: "NAC West Nile",
    publishedAt: "2025-08-28T08:00:00.000Z",
  }),
  article({
    id: "art-5",
    title: "GAP partners roll out youth budgeting tools",
    slug: "gap-youth-budgeting-tools",
    excerpt:
      "Youth Go Budget and SLOGBAA help young people engage local fiscal processes.",
    body: `Through Governance and Participation, partners are introducing Youth Go Budget and SLOGBAA so young people can follow and influence local budgets.`,
    author: "GAP team",
    publishedAt: "2025-08-05T08:00:00.000Z",
    cover: true,
  }),
  article({
    id: "art-6",
    title: "Urban gardens grow at Kampala youth spaces",
    slug: "urban-gardens-kampala-spaces",
    excerpt:
      "Kinawataka, Kawempe and Kirombe spaces demonstrate urban agriculture with community learning.",
    body: `Kampala youth spaces are expanding urban gardens as learning and livelihood hubs, with seedlings and demonstration sessions for visitors.`,
    author: null,
    publishedAt: "2025-07-18T08:00:00.000Z",
  }),
  article({
    id: "art-7",
    title: "Community journalism lifts neighbourhood priorities",
    slug: "community-journalism-priorities",
    excerpt:
      "Young reporters document community issues and bring them to duty bearers.",
    body: `Community Journalism supports young reporters to document neighbourhood priorities — from water access to safer public spaces — and share them with duty bearers.`,
    author: "Community Journalism",
    publishedAt: "2025-06-30T08:00:00.000Z",
    cover: true,
  }),
  article({
    id: "art-8",
    title: "Climate resilience walks map flood-prone settlements",
    slug: "climate-resilience-walks",
    excerpt:
      "YCR partners walk with residents to map risk and co-design adaptation actions.",
    body: `Youth Climate Resilience partners organised community walks in flood-prone settlements to map risk and identify practical adaptation steps.`,
    author: "YCR team",
    publishedAt: "2025-06-12T08:00:00.000Z",
  }),
  article({
    id: "art-9",
    title: "Mayuge Youth CSO Space opens its resource centre",
    slug: "mayuge-resource-centre",
    excerpt:
      "Hope Alive initiative and partners launch a community library and meeting point in Mayuge.",
    body: `Mayuge Youth CSO Space now hosts a community library and resource centre, strengthening Eastern Uganda’s youth organising network.`,
    author: null,
    publishedAt: "2025-05-20T08:00:00.000Z",
    cover: true,
  }),
  article({
    id: "art-10",
    title: "Ntugamo leaders meet on local budgets",
    slug: "ntugamo-local-budgets",
    excerpt:
      "Western Uganda’s youth space hosts dialogue on government programmes.",
    body: `Ntugamo Youth Space convened political youth leaders to discuss local budgets and access to government programmes.`,
    author: "NAC Western",
    publishedAt: "2025-04-28T08:00:00.000Z",
  }),
  article({
    id: "art-11",
    title: "English classes welcome urban refugees in Kisaasi",
    slug: "kisaasi-english-classes",
    excerpt:
      "Kisaasi Youth Space continues learning support for newly arrived urban refugees.",
    body: `Kisaasi Youth Space hosts English classes and shared workspace support for newly arrived urban refugees and member organisations.`,
    author: "Kisaasi Youth Space",
    publishedAt: "2025-04-02T08:00:00.000Z",
    cover: true,
  }),
  article({
    id: "art-12",
    title: "Strategic Plan 2024–2028 now available to download",
    slug: "strategic-plan-download",
    excerpt:
      "NAC’s strategic plan sets priorities for capability development and youth spaces.",
    body: `The NAC Strategic Plan 2024–2028 is available in Downloads. It outlines how the network will deepen youth resilience across Uganda.`,
    author: "NAC Secretariat",
    publishedAt: "2025-03-15T08:00:00.000Z",
    seoTitle: "Download NAC Strategic Plan 2024–2028",
    seoDescription: "Read and download the NAC Strategic Plan 2024–2028.",
  }),
  article({
    id: "art-13",
    title: "Kamwanyi space supports women-led enterprise",
    slug: "kamwanyi-women-led-enterprise",
    excerpt:
      "A Lake Victoria shoreline hub backs youth social entrepreneurs.",
    body: `Kamwanyi Youth Space, with HADE, supports youth social entrepreneurs through a women-led multifunctional hub on the Lake Victoria shoreline.`,
    author: null,
    publishedAt: "2025-02-20T08:00:00.000Z",
    cover: true,
  }),
  article({
    id: "art-14",
    title: "Yumbe organisations share a collaboration base",
    slug: "yumbe-collaboration-base",
    excerpt:
      "Ten local organisations share workspace, electricity and internet at Yumbe Youth Space.",
    body: `Yumbe Youth Space provides a shared base where local organisations collaborate with reliable electricity, internet and workspace.`,
    author: "NAC West Nile",
    publishedAt: "2025-01-28T08:00:00.000Z",
  }),
];
