"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { deleteMediaIfUnused } from "../../../lib/media-cleanup";
import { assertAdminSession } from "../../../lib/require-admin";
import { saveImageUpload } from "../../../lib/save-image-upload";
import { MAX_SPACE_PHOTOS } from "./limits";

const metaSchema = z.object({
  caption: z.string().trim().max(300).optional(),
  altText: z.string().trim().max(300).optional(),
});

async function done(spaceId: string, query = "saved=1"): Promise<never> {
  const space = await prisma.youthSpace.findUnique({
    where: { id: spaceId },
    select: { slug: true },
  });
  revalidatePath(`/admin/youth-spaces/${spaceId}`);
  revalidatePath("/youth-spaces");
  if (space) revalidatePath(`/youth-spaces/${space.slug}`);
  redirect(`/admin/youth-spaces/${spaceId}?${query}`);
}

export async function addSpacePhotos(spaceId: string, formData: FormData) {
  await assertAdminSession();
  const files = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (files.length === 0) redirect(`/admin/youth-spaces/${spaceId}?error=images-missing`);

  const existing = await prisma.youthSpaceImage.count({ where: { spaceId } });
  if (existing + files.length > MAX_SPACE_PHOTOS) {
    redirect(`/admin/youth-spaces/${spaceId}?error=photos-max`);
  }

  let order = existing;
  for (const file of files) {
    const upload = await saveImageUpload(file, "youth-spaces");
    if (!upload.ok) redirect(`/admin/youth-spaces/${spaceId}?error=image-${upload.error}`);
    await prisma.youthSpaceImage.create({
      data: { spaceId, mediaId: upload.mediaId, sortOrder: order },
    });
    order += 1;
  }
  await done(spaceId);
}

export async function updateSpacePhoto(imageId: string, spaceId: string, formData: FormData) {
  await assertAdminSession();
  const parsed = metaSchema.safeParse({
    caption: String(formData.get("caption") ?? "") || undefined,
    altText: String(formData.get("altText") ?? "") || undefined,
  });
  if (!parsed.success) redirect(`/admin/youth-spaces/${spaceId}?error=validation`);

  const image = await prisma.youthSpaceImage.update({
    where: { id: imageId },
    data: { caption: parsed.data.caption ?? null },
    select: { mediaId: true },
  });
  await prisma.mediaAsset.update({
    where: { id: image.mediaId },
    data: { altText: parsed.data.altText ?? null },
  });
  await done(spaceId);
}

export async function moveSpacePhoto(imageId: string, spaceId: string, direction: "up" | "down") {
  await assertAdminSession();
  const images = await prisma.youthSpaceImage.findMany({
    where: { spaceId },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  const index = images.findIndex((row) => row.id === imageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= images.length) await done(spaceId, "");

  const reordered = [...images];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith]!, reordered[index]!];
  await prisma.$transaction(
    reordered.map((row, i) =>
      prisma.youthSpaceImage.update({ where: { id: row.id }, data: { sortOrder: i } }),
    ),
  );
  await done(spaceId);
}

export async function removeSpacePhoto(imageId: string, spaceId: string) {
  await assertAdminSession();
  const removed = await prisma.youthSpaceImage.delete({
    where: { id: imageId },
    select: { mediaId: true },
  });
  await deleteMediaIfUnused([removed.mediaId]);
  await done(spaceId);
}
