/**
 * Member organisations seed rows for Epic E16 (Dev A).
 * Mirrors published CMS shape; no database access here.
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
  websiteUrl: string | null;
  sortOrder: number;
  images: SeedMemberImage[];
};

export const SEED_MEMBER_ORGANISATIONS: SeedMemberOrganisation[] = [
  {
    id: "mo-oboivu",
    name: "OBOIVU",
    slug: "oboivu",
    sortOrder: 1,
    websiteUrl: null,
    bio: `One By One Initiative for Vulnerable Communities in Uganda (OBOIVU) is a youth-led organisation working with communities in Kampala’s informal settlements.

OBOIVU partners with NAC at Kinawataka Youth Space, supporting reading, learning and local enterprise for young people.`,
    images: [],
  },
  {
    id: "mo-hade",
    name: "HADE",
    slug: "hade",
    sortOrder: 2,
    websiteUrl: null,
    bio: `Holistic Action for Development and Empowerment (HADE) is a women-led organisation supporting youth social enterprise along Lake Victoria.

HADE co-manages Kamwanyi Youth Space with NAC, including a container shop for water hyacinth and bamboo products.`,
    images: [],
  },
  {
    id: "mo-civact",
    name: "Civact",
    slug: "civact",
    sortOrder: 3,
    websiteUrl: null,
    bio: `Civact is a civic organising partner in the NAC network. At Kitintale Youth Space it helps young people meet local leaders through village meetings and youth parliament sessions.`,
    images: [],
  },
  {
    id: "mo-uyonet",
    name: "UYONET",
    slug: "uyonet",
    sortOrder: 4,
    websiteUrl: "https://uyonet.or.ug",
    bio: `Uganda Youth Network (UYONET) partners with NAC on tools that help young people take part in local budgeting and governance, including the Youth Go Budget app.`,
    images: [],
  },
];
