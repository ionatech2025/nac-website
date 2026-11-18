"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureAboutPage, prisma } from "@repo/database";
import { deleteMediaIfUnused } from "../../../lib/media-cleanup";
import { assertAdminSession } from "../../../lib/require-admin";
import { saveImageUpload } from "../../../lib/save-image-upload";
import { MAX_ABOUT_PHOTOS } from "./limits";

const ABOUT_ID = "about";

const metaSchema = z.object({
  caption: z.string().trim().max(300).optional(),
  altText: z.string().trim().max(300).optional(),
});

async function done(query = "saved=1"): Promise<never> {
  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect(`/admin/about?${query}`);
}

export async function addAboutPhotos(formData: FormData) {
  await assertAdminSession();
  await ensureAboutPage();
  const files = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (files.length === 0) redirect("/admin/about?error=images-missing");

  const existing = await prisma.aboutPageImage.count({ where: { aboutPageId: ABOUT_ID } });
  if (existing + files.length > MAX_ABOUT_PHOTOS) {
    redirect("/admin/about?error=photos-max");
  }

  let order = existing;
  for (const file of files) {
    const upload = await saveImageUpload(file, "about");
    if (!upload.ok) redirect(`/admin/about?error=image-${upload.error}`);
    await prisma.aboutPageImage.create({
      data: { aboutPageId: ABOUT_ID, mediaId: upload.mediaId, sortOrder: order },
    });
    order += 1;
  }
  await done();
}

export async function updateAboutPhoto(imageId: string, formData: FormData) {
  await assertAdminSession();
  const parsed = metaSchema.safeParse({
    caption: String(formData.get("caption") ?? "") || undefined,
    altText: String(formData.get("altText") ?? "") || undefined,
  });
  if (!parsed.success) redirect("/admin/about?error=validation");

  const image = await prisma.aboutPageImage.update({
    where: { id: imageId },
    data: { caption: parsed.data.caption ?? null },
    select: { mediaId: true },
  });
  await prisma.mediaAsset.update({
    where: { id: image.mediaId },
    data: { altText: parsed.data.altText ?? null },
  });
  await done();
}

export async function moveAboutPhoto(imageId: string, direction: "up" | "down") {
  await assertAdminSession();
  const images = await prisma.aboutPageImage.findMany({
    where: { aboutPageId: ABOUT_ID },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  const index = images.findIndex((row) => row.id === imageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= images.length) await done("");

  const reordered = [...images];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith]!, reordered[index]!];
  await prisma.$transaction(
    reordered.map((row, i) =>
      prisma.aboutPageImage.update({ where: { id: row.id }, data: { sortOrder: i } }),
    ),
  );
  await done();
}

export async function removeAboutPhoto(imageId: string) {
  await assertAdminSession();
  const removed = await prisma.aboutPageImage.delete({
    where: { id: imageId },
    select: { mediaId: true },
  });
  await deleteMediaIfUnused([removed.mediaId]);
  await done();
}
