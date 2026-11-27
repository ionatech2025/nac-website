/**
 * Homepage content for Epic E2 — public helpers from `@repo/database`.
 */

import {
  getPublishedAboutPage,
  listKeyFigures,
  listPublishedArticles,
  listPublishedDocuments,
  listPublishedFeaturedConcepts,
  listPublishedPartners,
  listPublishedSlideshowImages,
  listPublishedVideos,
  mediaVariantUrl,
} from "@repo/database";

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
};

const FALLBACK_IDENTITY: HomeIdentity = {
  orgName: "Network for Active Citizens",
  tagline: "Locally Engaged, Globally Connected",
  mission:
    "To build youth resilience in Uganda through capability development and policy outreach.",
  vision: "A resilient and prosperous Uganda",
};

export async function getHomePageData(): Promise<HomePageData> {
  const [
    about,
    slides,
    articles,
    videos,
    concepts,
    partners,
    keyFigures,
    documents,
  ] = await Promise.all([
    getPublishedAboutPage(),
    listPublishedSlideshowImages(20),
    listPublishedArticles(3),
    listPublishedVideos(6),
    listPublishedFeaturedConcepts(20),
    listPublishedPartners(50),
    listKeyFigures(),
    listPublishedDocuments(4),
  ]);

  return {
    identity: {
      orgName: FALLBACK_IDENTITY.orgName,
      tagline: FALLBACK_IDENTITY.tagline,
      mission: about?.mission?.trim() || FALLBACK_IDENTITY.mission,
      vision: about?.vision?.trim() || FALLBACK_IDENTITY.vision,
    },
    slides: slides.map((slide) => ({
      id: slide.id,
      imageUrl: mediaVariantUrl(slide.media, "medium"),
      altText: slide.altText?.trim() || slide.media.altText || "Slideshow image",
      caption: slide.caption?.trim() || undefined,
      destinationUrl: slide.destinationUrl?.trim() || undefined,
    })),
    stories: articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt?.trim() || "",
      imageUrl: article.coverImage
        ? mediaVariantUrl(article.coverImage, "medium")
        : undefined,
      imageAlt: article.coverImage?.altText || undefined,
    })),
    videos: videos
      .filter(
        (video): video is typeof video & { provider: "YOUTUBE" | "VIMEO" } =>
          video.provider === "YOUTUBE" || video.provider === "VIMEO",
      )
      .map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description?.trim() || undefined,
        provider: video.provider,
        url: video.url,
      })),
    featuredConcepts: concepts.map((concept) => ({
      id: concept.id,
      title: concept.title,
      summary: concept.summary?.trim() || undefined,
      destinationUrl: concept.destinationUrl?.trim() || undefined,
    })),
    partners: partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      logoUrl: partner.logo
        ? mediaVariantUrl(partner.logo, "medium")
        : undefined,
      websiteUrl: partner.websiteUrl?.trim() || undefined,
    })),
    keyFigures: keyFigures.map((figure) => ({
      id: figure.id,
      label: figure.label,
      value: figure.value,
    })),
    downloads: documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      href: doc.downloadPath,
      byteSize: doc.byteSize,
      fileType: doc.fileType,
    })),
  };
}
