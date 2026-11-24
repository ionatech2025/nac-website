/**
 * Galleries seed/fallback for Epic E10 (Dev A).
 * Matches Dev B contract shape; swap to @repo/database helpers later.
 */

import {
  SEED_ALBUMS,
  SEED_VIDEOS,
  type SeedAlbum,
} from "./galleries-seed";

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

function toListItem(album: SeedAlbum): AlbumListItem {
  return {
    id: album.id,
    title: album.title,
    slug: album.slug,
    coverUrl: album.coverUrl ?? album.images[0]?.url ?? null,
    coverAlt: imageAlt(
      album.coverAlt,
      album.images[0]?.caption ?? null,
      album.title,
    ),
    imageCount: album.images.length,
  };
}

function toDetail(album: SeedAlbum): AlbumDetail {
  return {
    ...toListItem(album),
    images: album.images.map((image, index) => ({
      id: image.id,
      url: image.url,
      altText: imageAlt(image.altText, image.caption, `${album.title} photo ${index + 1}`),
      caption: image.caption,
    })),
  };
}

const albums = [...SEED_ALBUMS].sort((a, b) => a.sortOrder - b.sortOrder);
const videos = [...SEED_VIDEOS].sort((a, b) => a.sortOrder - b.sortOrder);

export async function listAlbumsPage(request: {
  page?: number;
  pageSize?: number;
} = {}): Promise<AlbumsPage> {
  const pageSize = Math.min(Math.max(Math.floor(request.pageSize ?? 12) || 12, 1), 100);
  const pageCount = Math.max(1, Math.ceil(albums.length / pageSize));
  const page = Math.min(Math.max(Math.floor(Number(request.page)) || 1, 1), pageCount);
  const start = (page - 1) * pageSize;
  return {
    items: albums.slice(start, start + pageSize).map(toListItem),
    page,
    pageSize,
    total: albums.length,
    pageCount,
  };
}

export async function getAlbumBySlug(slug: string): Promise<AlbumDetail | null> {
  const album = albums.find((row) => row.slug === slug);
  return album ? toDetail(album) : null;
}

export async function listVideos(): Promise<GalleryVideo[]> {
  return videos.map((video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    provider: video.provider,
    url: video.url,
  }));
}
