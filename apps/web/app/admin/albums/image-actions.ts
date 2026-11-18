"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { deleteMediaIfUnused } from "../../../lib/media-cleanup";
import { assertAdminSession } from "../../../lib/require-admin";
import { saveImageUpload } from "../../../lib/save-image-upload";

const metaSchema = z.object({
  caption: z.string().trim().max(500).optional(),
  altText: z.string().trim().max(300).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function revalidate(albumId: string) {
  revalidatePath("/admin/albums");
  revalidatePath(`/admin/albums/${albumId}`);
}

export async function addAlbumImages(albumId: string, formData: FormData) {
  await assertAdminSession();
  const files = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);

  if (files.length === 0) {
    redirect(`/admin/albums/${albumId}?error=images-missing`);
  }

  const existing = await prisma.photoImage.count({ where: { albumId } });
  let order = existing;
  const createdMediaIds: string[] = [];

  for (const file of files) {
    const upload = await saveImageUpload(file, "albums");
    if (!upload.ok) {
      redirect(`/admin/albums/${albumId}?error=image-${upload.error}`);
    }
    await prisma.photoImage.create({
      data: {
        albumId,
        mediaId: upload.mediaId,
        sortOrder: order,
        altText: null,
        caption: null,
      },
    });
    createdMediaIds.push(upload.mediaId);
    order += 1;
  }

  const album = await prisma.photoAlbum.findUnique({
    where: { id: albumId },
    select: { coverMediaId: true },
  });
  if (album && !album.coverMediaId && createdMediaIds[0]) {
    await prisma.photoAlbum.update({
      where: { id: albumId },
      data: { coverMediaId: createdMediaIds[0] },
    });
  }

  revalidate(albumId);
  redirect(`/admin/albums/${albumId}?saved=1`);
}

export async function updateAlbumImage(
  imageId: string,
  albumId: string,
  formData: FormData,
) {
  await assertAdminSession();
  const parsed = metaSchema.safeParse({
    caption: String(formData.get("caption") ?? "") || undefined,
    altText: String(formData.get("altText") ?? "") || undefined,
    sortOrder: String(formData.get("sortOrder") ?? "0"),
  });
  if (!parsed.success) {
    redirect(`/admin/albums/${albumId}?error=validation`);
  }

  await prisma.photoImage.update({
    where: { id: imageId },
    data: {
      caption: parsed.data.caption || null,
      altText: parsed.data.altText || null,
      sortOrder: parsed.data.sortOrder,
    },
  });

  revalidate(albumId);
  redirect(`/admin/albums/${albumId}?saved=1`);
}

export async function removeAlbumImage(imageId: string, albumId: string) {
  await assertAdminSession();
  const image = await prisma.photoImage.findUnique({
    where: { id: imageId },
    select: { mediaId: true },
  });
  if (!image) {
    redirect(`/admin/albums/${albumId}?error=missing`);
  }

  await prisma.photoImage.delete({ where: { id: imageId } });

  const album = await prisma.photoAlbum.findUnique({
    where: { id: albumId },
    select: { coverMediaId: true },
  });
  if (album?.coverMediaId === image.mediaId) {
    const next = await prisma.photoImage.findFirst({
      where: { albumId },
      orderBy: { sortOrder: "asc" },
      select: { mediaId: true },
    });
    await prisma.photoAlbum.update({
      where: { id: albumId },
      data: { coverMediaId: next?.mediaId ?? null },
    });
  }
  await deleteMediaIfUnused([image.mediaId]);

  revalidate(albumId);
  redirect(`/admin/albums/${albumId}?saved=1`);
}

export async function moveAlbumImage(
  imageId: string,
  albumId: string,
  direction: "up" | "down",
) {
  await assertAdminSession();
  const images = await prisma.photoImage.findMany({
    where: { albumId },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true, sortOrder: true },
  });
  const index = images.findIndex((row) => row.id === imageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= images.length) {
    redirect(`/admin/albums/${albumId}`);
  }

  const a = images[index]!;
  const b = images[swapWith]!;
  await prisma.$transaction([
    prisma.photoImage.update({
      where: { id: a.id },
      data: { sortOrder: b.sortOrder },
    }),
    prisma.photoImage.update({
      where: { id: b.id },
      data: { sortOrder: a.sortOrder },
    }),
  ]);

  revalidate(albumId);
  redirect(`/admin/albums/${albumId}?saved=1`);
}
