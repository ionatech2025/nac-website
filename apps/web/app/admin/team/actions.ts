"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { optionalRichText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import type { ContentStatusValue } from "../../../lib/content-status";
import { saveImageUpload } from "../../../lib/save-image-upload";

const teamFields = z.object({
  name: z.string().trim().min(1).max(120),
  roleTitle: z.string().trim().min(1).max(120),
  biography: optionalRichText(5000),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function photoField(formData: FormData): File | null {
  const value = formData.get("photo");
  return value instanceof File ? value : null;
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.teamMember.update({ where: { id }, data: { status } });
  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${id}`);
}

export async function createTeamMember(formData: FormData) {
  await assertAdminSession();
  const parsed = teamFields.safeParse({
    name: formString(formData, "name"),
    roleTitle: formString(formData, "roleTitle"),
    biography: formString(formData, "biography") || undefined,
    sortOrder: formString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) {
    redirect("/admin/team/new?error=validation");
  }

  const upload = await saveImageUpload(photoField(formData), "team", {
    required: true,
  });
  if (!upload.ok) {
    redirect(`/admin/team/new?error=photo-${upload.error}`);
  }

  const member = await prisma.teamMember.create({
    data: {
      name: parsed.data.name,
      roleTitle: parsed.data.roleTitle,
      biography: parsed.data.biography || null,
      sortOrder: parsed.data.sortOrder,
      status: "DRAFT",
      photoId: upload.mediaId,
    },
  });

  revalidatePath("/admin/team");
  redirect(`/admin/team/${member.id}`);
}

export async function updateTeamMember(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = teamFields.safeParse({
    name: formString(formData, "name"),
    roleTitle: formString(formData, "roleTitle"),
    biography: formString(formData, "biography") || undefined,
    sortOrder: formString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) {
    redirect(`/admin/team/${id}?error=validation`);
  }

  const file = photoField(formData);
  let photoId: string | undefined;
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "team");
    if (!upload.ok) {
      redirect(`/admin/team/${id}?error=photo-${upload.error}`);
    }
    photoId = upload.mediaId;
  }

  await prisma.teamMember.update({
    where: { id },
    data: {
      name: parsed.data.name,
      roleTitle: parsed.data.roleTitle,
      biography: parsed.data.biography || null,
      sortOrder: parsed.data.sortOrder,
      ...(photoId ? { photoId } : {}),
    },
  });

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${id}`);
  redirect(`/admin/team/${id}?saved=1`);
}

export async function publishTeamMember(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/team/${id}?saved=1`);
}

export async function unpublishTeamMember(id: string) {
  await setStatus(id, "DRAFT");
  redirect(`/admin/team/${id}?saved=1`);
}

export async function archiveTeamMember(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/team");
}
