/**
 * Seed galleries for Epic E10 until CMS publish helpers are wired.
 */

export type SeedAlbumImage = {
  id: string;
  url: string;
  altText: string | null;
  caption: string | null;
};

export type SeedAlbum = {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  coverUrl: string | null;
  coverAlt: string | null;
  images: SeedAlbumImage[];
};

export type SeedVideo = {
  id: string;
  title: string;
  description: string | null;
  provider: "YOUTUBE" | "VIMEO" | "OTHER";
  url: string;
  sortOrder: number;
};

const BANNER =
  "https://nacuganda.org/sites/default/files/styles/banner_image/public/Banner%20Images/IMG_8729_optimized_1.jpeg";

export const SEED_ALBUMS: SeedAlbum[] = [
  {
    id: "album-1",
    title: "Youth CSO Market",
    slug: "youth-cso-market",
    sortOrder: 0,
    coverUrl: BANNER,
    coverAlt: "Youth organisers gathered at the CSO Market",
    images: [
      {
        id: "img-1a",
        url: BANNER,
        altText: "Crowds of youth organisers under evening lights",
        caption: "Opening of the Youth CSO Market in Kampala",
      },
      {
        id: "img-1b",
        url: BANNER,
        altText: "Member organisations sharing tables and materials",
        caption: "Member organisations showcasing their work",
      },
      {
        id: "img-1c",
        url: BANNER,
        altText: "Young people networking around exhibition stalls",
        caption: null,
      },
    ],
  },
  {
    id: "album-2",
    title: "West Nile youth spaces",
    slug: "west-nile-youth-spaces",
    sortOrder: 1,
    coverUrl: BANNER,
    coverAlt: "Community activity at a West Nile youth space",
    images: [
      {
        id: "img-2a",
        url: BANNER,
        altText: "Co-working session at Arua Youth Space",
        caption: "Peer learning at Arua Youth Space",
      },
      {
        id: "img-2b",
        url: BANNER,
        altText: "Shared workspace used by local organisations in Yumbe",
        caption: "Shared base for organisations in Yumbe",
      },
    ],
  },
  {
    id: "album-3",
    title: "Partners forum moments",
    slug: "partners-forum-moments",
    sortOrder: 2,
    coverUrl: null,
    coverAlt: null,
    images: [
      {
        id: "img-3a",
        url: BANNER,
        altText: "Partners seated in a plenary discussion",
        caption: "Plenary discussion during the partners forum",
      },
      {
        id: "img-3b",
        url: BANNER,
        altText: null,
        caption: "Breakout conversations among member organisations",
      },
      {
        id: "img-3c",
        url: BANNER,
        altText: "Group photo of NAC partners",
        caption: "Closing group photo",
      },
      {
        id: "img-3d",
        url: BANNER,
        altText: "Speakers on stage at the forum",
        caption: null,
      },
    ],
  },
];

export const SEED_VIDEOS: SeedVideo[] = [
  {
    id: "vid-1",
    title: "NAC network introduction",
    description:
      "A short introduction to Network for Active Citizens and youth organising across Uganda.",
    provider: "YOUTUBE",
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    sortOrder: 0,
  },
  {
    id: "vid-2",
    title: "Community storytelling sample",
    description: "Example Vimeo embed used for gallery playback testing.",
    provider: "VIMEO",
    url: "https://vimeo.com/76979871",
    sortOrder: 1,
  },
  {
    id: "vid-3",
    title: "Unsupported provider sample",
    description:
      "Stored for graceful failure — only YouTube and Vimeo embeds are allowed.",
    provider: "OTHER",
    url: "https://example.com/not-a-video",
    sortOrder: 2,
  },
];
