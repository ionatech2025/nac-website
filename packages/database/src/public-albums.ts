import { prisma } from "./client";
import { boundedTake, pageWindow, toPage, type PageRequest } from "./pagination";
import { PUBLIC_IMAGE_SELECT } from "./media-urls";

const imageInclude = {
  images: {
    orderBy: [{ sortOrder: "asc" as const }, { id: "asc" as const }],
    include: {
      media: { select: PUBLIC_IMAGE_SELECT },
    },
  },
  coverMedia: { select: PUBLIC_IMAGE_SELECT },
};

/** Published albums for the public gallery (AD-B3-05). */
export async function listPublishedAlbums(limit = 50) {
  return prisma.photoAlbum.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    take: boundedTake(limit),
    include: {
      coverMedia: { select: PUBLIC_IMAGE_SELECT },
      _count: { select: { images: true } },
    },
  });
}

/** Paged gallery (`?page=`). */
export async function listPublishedAlbumsPage(request: PageRequest = {}) {
  const window = pageWindow(request);
  const where = { status: "PUBLISHED" as const };
  const [items, total] = await Promise.all([
    prisma.photoAlbum.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      skip: window.skip,
      take: window.take,
      include: { coverMedia: { select: PUBLIC_IMAGE_SELECT }, _count: { select: { images: true } } },
    }),
    prisma.photoAlbum.count({ where }),
  ]);
  return toPage(items, total, window);
}

export async function getPublishedAlbumBySlug(slug: string) {
  return prisma.photoAlbum.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: imageInclude,
  });
}
