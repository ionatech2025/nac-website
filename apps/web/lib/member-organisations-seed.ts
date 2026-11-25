/**
 * Member organisations seed rows for Epic E16 (Dev A).
 * Mirrors published CMS shape; no database access here.
 * Images are local copies from nacuganda.org album covers / banners.
 */

export type SeedMemberImage = {
  id: string;
  caption: string | null;
  url: string;
  altText: string;
};

export type SeedMemberOrganisation = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  /** Optional website or social URL from admin. */
  websiteUrl: string | null;
  sortOrder: number;
  /** Up to 3 images (admin order). */
  images: SeedMemberImage[];
};

export const SEED_MEMBER_ORGANISATIONS: SeedMemberOrganisation[] = [
  {
    id: "mo-oboivu",
    name: "OBOIVU",
    slug: "oboivu",
    sortOrder: 1,
    websiteUrl: "https://facebook.com/networkforactivecitizens",
    bio: `One By One Initiative for Vulnerable Communities in Uganda (OBOIVU) is a youth-led organisation working with communities in Kampala’s informal settlements.

OBOIVU partners with NAC at Kinawataka Youth Space, supporting reading, learning and local enterprise for young people.`,
    images: [
      {
        id: "mo-oboivu-1",
        caption: "Community learning at Kinawataka",
        url: "/seed/members/oboivu.jpg",
        altText: "Young people gathered for a community activity",
      },
      {
        id: "mo-oboivu-2",
        caption: null,
        url: "/seed/members/banner.jpg",
        altText: "Youth space workshop session",
      },
    ],
  },
  {
    id: "mo-hade",
    name: "HADE",
    slug: "hade",
    sortOrder: 2,
    websiteUrl: null,
    bio: `Holistic Action for Development and Empowerment (HADE) is a women-led organisation supporting youth social enterprise along Lake Victoria.

HADE co-manages Kamwanyi Youth Space with NAC, including a container shop for water hyacinth and bamboo products.`,
    images: [
      {
        id: "mo-hade-1",
        caption: "Enterprise support at Kamwanyi",
        url: "/seed/members/hade.jpg",
        altText: "Youth social enterprise activity by the lake",
      },
    ],
  },
  {
    id: "mo-civact",
    name: "Civact",
    slug: "civact",
    sortOrder: 3,
    websiteUrl: null,
    bio: `Civact is a civic organising partner in the NAC network. At Kitintale Youth Space it helps young people meet local leaders through village meetings and youth parliament sessions.`,
    images: [
      {
        id: "mo-civact-1",
        caption: "Civic organising at Kitintale",
        url: "/seed/members/civact.jpg",
        altText: "Young people in a civic organising session",
      },
    ],
  },
  {
    id: "mo-uyonet",
    name: "UYONET",
    slug: "uyonet",
    sortOrder: 4,
    websiteUrl: "https://uyonet.or.ug",
    bio: `Uganda Youth Network (UYONET) partners with NAC on tools that help young people take part in local budgeting and governance, including the Youth Go Budget app.`,
    images: [
      {
        id: "mo-uyonet-1",
        caption: "Budgeting tools for young people",
        url: "/seed/members/uyonet.jpg",
        altText: "Young people learning about local budgeting",
      },
      {
        id: "mo-uyonet-2",
        caption: null,
        url: "/seed/members/activity.jpg",
        altText: "UYONET and NAC partnership activity",
      },
      {
        id: "mo-uyonet-3",
        caption: "Community dialogue",
        url: "/seed/members/banner.jpg",
        altText: "Community dialogue session",
      },
    ],
  },
];
