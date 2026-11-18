"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { deleteMediaIfUnused } from "../../../lib/media-cleanup";
import { assertAdminSession } from "../../../lib/require-admin";
import { saveImageUpload } from "../../../lib/save-image-upload";
import { MAX_PROGRAMME_PHOTOS } from "./limits";

const metaSchema = z.object({
  caption: z.string().trim().max(300).optional(),
  altText: z.string().trim().max(300).optional(),
});

async function done(programmeId: string, query = "saved=1"): Promise<never> {
  const programme = await prisma.programme.findUnique({
    where: { id: programmeId },
    select: { slug: true },
  });
  revalidatePath(`/admin/programmes/${programmeId}`);
  revalidatePath("/programmes");
  if (programme) revalidatePath(`/programmes/${programme.slug}`);
  redirect(`/admin/programmes/${programmeId}?${query}`);
}

export async function addProgrammePhotos(programmeId: string, formData: FormData) {
  await assertAdminSession();
  const files = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (files.length === 0) redirect(`/admin/programmes/${programmeId}?error=images-missing`);

  const existing = await prisma.programmeGalleryImage.count({ where: { programmeId } });
  if (existing + files.length > MAX_PROGRAMME_PHOTOS) {
    redirect(`/admin/programmes/${programmeId}?error=photos-max`);
  }

  let order = existing;
  for (const file of files) {
    const upload = await saveImageUpload(file, "programmes");
    if (!upload.ok) redirect(`/admin/programmes/${programmeId}?error=image-${upload.error}`);
    await prisma.programmeGalleryImage.create({
      data: { programmeId, mediaId: upload.mediaId, sortOrder: order },
    });
    order += 1;
  }
  await done(programmeId);
}

export async function updateProgrammePhoto(
  imageId: string,
  programmeId: string,
  formData: FormData,
) {
  await assertAdminSession();
  const parsed = metaSchema.safeParse({
    caption: String(formData.get("caption") ?? "") || undefined,
    altText: String(formData.get("altText") ?? "") || undefined,
  });
  if (!parsed.success) redirect(`/admin/programmes/${programmeId}?error=validation`);

  const image = await prisma.programmeGalleryImage.update({
    where: { id: imageId },
    data: { caption: parsed.data.caption ?? null },
    select: { mediaId: true },
  });
  await prisma.mediaAsset.update({
    where: { id: image.mediaId },
    data: { altText: parsed.data.altText ?? null },
  });
  await done(programmeId);
}

export async function moveProgrammePhoto(
  imageId: string,
  programmeId: string,
  direction: "up" | "down",
) {
  await assertAdminSession();
  const images = await prisma.programmeGalleryImage.findMany({
    where: { programmeId },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  const index = images.findIndex((row) => row.id === imageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= images.length) await done(programmeId, "");

  const reordered = [...images];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith]!, reordered[index]!];
  await prisma.$transaction(
    reordered.map((row, i) =>
      prisma.programmeGalleryImage.update({ where: { id: row.id }, data: { sortOrder: i } }),
    ),
  );
  await done(programmeId);
}

export async function removeProgrammePhoto(imageId: string, programmeId: string) {
  await assertAdminSession();
  const removed = await prisma.programmeGalleryImage.delete({
    where: { id: imageId },
    select: { mediaId: true },
  });
  await deleteMediaIfUnused([removed.mediaId]);
  await done(programmeId);
}
