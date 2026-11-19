"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { deleteMediaIfUnused } from "../../../lib/media-cleanup";
import { assertAdminSession } from "../../../lib/require-admin";
import { saveImageUpload } from "../../../lib/save-image-upload";
import { MAX_ORG_PHOTOS } from "./limits";

const metaSchema = z.object({
  caption: z.string().trim().max(300).optional(),
  altText: z.string().trim().max(300).optional(),
});

async function done(organisationId: string, query = "saved=1"): Promise<never> {
  const org = await prisma.memberOrganisation.findUnique({
    where: { id: organisationId },
    select: { slug: true },
  });
  revalidatePath(`/admin/member-organisations/${organisationId}`);
  revalidatePath("/member-organisations");
  if (org) revalidatePath(`/member-organisations/${org.slug}`);
  redirect(`/admin/member-organisations/${organisationId}?${query}`);
}

export async function addOrganisationPhotos(organisationId: string, formData: FormData) {
  await assertAdminSession();
  const files = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0);
  if (files.length === 0) {
    redirect(`/admin/member-organisations/${organisationId}?error=images-missing`);
  }

  const existing = await prisma.memberOrganisationImage.count({
    where: { organisationId },
  });
  if (existing + files.length > MAX_ORG_PHOTOS) {
    redirect(`/admin/member-organisations/${organisationId}?error=photos-max`);
  }

  let order = existing;
  for (const file of files) {
    const upload = await saveImageUpload(file, "member-organisations");
    if (!upload.ok) {
      redirect(`/admin/member-organisations/${organisationId}?error=image-${upload.error}`);
    }
    await prisma.memberOrganisationImage.create({
      data: { organisationId, mediaId: upload.mediaId, sortOrder: order },
    });
    order += 1;
  }
  await done(organisationId);
}

export async function updateOrganisationPhoto(
  imageId: string,
  organisationId: string,
  formData: FormData,
) {
  await assertAdminSession();
  const parsed = metaSchema.safeParse({
    caption: String(formData.get("caption") ?? "") || undefined,
    altText: String(formData.get("altText") ?? "") || undefined,
  });
  if (!parsed.success) {
    redirect(`/admin/member-organisations/${organisationId}?error=validation`);
  }

  const image = await prisma.memberOrganisationImage.update({
    where: { id: imageId },
    data: { caption: parsed.data.caption ?? null },
    select: { mediaId: true },
  });
  await prisma.mediaAsset.update({
    where: { id: image.mediaId },
    data: { altText: parsed.data.altText ?? null },
  });
  await done(organisationId);
}

export async function moveOrganisationPhoto(
  imageId: string,
  organisationId: string,
  direction: "up" | "down",
) {
  await assertAdminSession();
  const images = await prisma.memberOrganisationImage.findMany({
    where: { organisationId },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  const index = images.findIndex((row) => row.id === imageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= images.length) {
    await done(organisationId, "");
  }

  const reordered = [...images];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith]!, reordered[index]!];
  await prisma.$transaction(
    reordered.map((row, i) =>
      prisma.memberOrganisationImage.update({
        where: { id: row.id },
        data: { sortOrder: i },
      }),
    ),
  );
  await done(organisationId);
}

export async function removeOrganisationPhoto(imageId: string, organisationId: string) {
  await assertAdminSession();
  const removed = await prisma.memberOrganisationImage.delete({
    where: { id: imageId },
    select: { mediaId: true },
  });
  await deleteMediaIfUnused([removed.mediaId]);
  await done(organisationId);
}
