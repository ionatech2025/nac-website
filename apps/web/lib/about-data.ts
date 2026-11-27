/**
 * About Us (E03) — published about page, key figures, and programmes.
 */

import {
  getPublishedAboutPage,
  listKeyFigures,
  listPublishedProgrammes,
  mediaVariantUrl,
} from "@repo/database";

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

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const page = await getPublishedAboutPage();
  return {
    title: page?.title?.trim() || "About us",
    mission: page?.mission?.trim() || "",
    vision: page?.vision?.trim() || "",
    whatWeDo: page?.whatWeDo?.trim() || "",
    why: page?.why?.trim() || "",
    images: (page?.images ?? []).map((image) => ({
      id: image.id,
      caption: image.caption,
      media: {
        url: image.media.url,
        altText: image.media.altText,
        thumbUrl: image.media.thumbUrl,
        mediumUrl: image.media.mediumUrl,
        width: image.media.width,
        height: image.media.height,
      },
    })),
  };
}

export async function getAboutKeyFigures(): Promise<AboutFigure[]> {
  const figures = await listKeyFigures();
  return figures.map((figure) => ({
    id: figure.id,
    label: figure.label,
    value: figure.value,
  }));
}

export async function getAboutProgrammes(): Promise<AboutProgramme[]> {
  const programmes = await listPublishedProgrammes();
  return programmes.map((programme) => ({
    id: programme.id,
    title: programme.title,
    slug: programme.slug,
    summary: programme.summary,
    body: null,
  }));
}

export async function getAboutProgrammeBySlug(
  slug: string,
): Promise<AboutProgramme | null> {
  const programmes = await getAboutProgrammes();
  return programmes.find((programme) => programme.slug === slug) ?? null;
}

export function aboutImageSrc(media: AboutMedia): string {
  return mediaVariantUrl(media, "medium");
}
