/**
 * Galleries (E10) — published albums and videos from `@repo/database`.
 */

import {
  getPublishedAlbumBySlug,
  listPublishedAlbumsPage,
  listPublishedVideos,
  mediaVariantUrl,
} from "@repo/database";

export type GalleryImage = {
  id: string;
  url: string;
  altText: string;
  caption: string | null;
};

export type AlbumListItem = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  coverAlt: string;
  imageCount: number;
};

export type AlbumDetail = AlbumListItem & {
  images: GalleryImage[];
};

export type AlbumsPage = {
  items: AlbumListItem[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export type GalleryVideo = {
  id: string;
  title: string;
  description: string | null;
  provider: "YOUTUBE" | "VIMEO" | "OTHER";
  url: string;
};

function imageAlt(alt: string | null, caption: string | null, fallback: string) {
  return alt?.trim() || caption?.trim() || fallback;
}

export async function listAlbumsPage(request: {
  page?: number;
  pageSize?: number;
} = {}): Promise<AlbumsPage> {
  const page = await listPublishedAlbumsPage(request);
  return {
    items: page.items.map((album) => ({
      id: album.id,
      title: album.title,
      slug: album.slug,
      coverUrl: album.coverMedia
        ? mediaVariantUrl(album.coverMedia, "medium")
        : null,
      coverAlt: album.coverMedia?.altText?.trim() || album.title,
      imageCount: album._count.images,
    })),
    page: page.page,
    pageSize: page.pageSize,
    total: page.total,
    pageCount: page.pageCount,
  };
}

export async function getAlbumBySlug(slug: string): Promise<AlbumDetail | null> {
  const album = await getPublishedAlbumBySlug(slug);
  if (!album) return null;

  const images = album.images.map((image, index) => ({
    id: image.id,
    url: mediaVariantUrl(image.media, "medium"),
    altText: imageAlt(
      image.altText ?? image.media.altText,
      image.caption,
      `${album.title} photo ${index + 1}`,
    ),
    caption: image.caption,
  }));

  const coverUrl = album.coverMedia
    ? mediaVariantUrl(album.coverMedia, "medium")
    : images[0]?.url ?? null;

  return {
    id: album.id,
    title: album.title,
    slug: album.slug,
    coverUrl,
    coverAlt: album.coverMedia?.altText?.trim() || images[0]?.altText || album.title,
    imageCount: images.length,
    images,
  };
}

export async function listVideos(): Promise<GalleryVideo[]> {
  const videos = await listPublishedVideos();
  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    provider:
      video.provider === "YOUTUBE" || video.provider === "VIMEO"
        ? video.provider
        : "OTHER",
    url: video.url,
  }));
}
