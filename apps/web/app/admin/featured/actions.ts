"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { optionalRichText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import type { ContentStatusValue } from "../../../lib/content-status";
import { parseOptionalHref } from "../../../lib/cms-link";
import { saveImageUpload } from "../../../lib/save-image-upload";

const fields = z.object({
  title: z.string().trim().min(1).max(200),
  summary: optionalRichText(2000),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function imageField(formData: FormData): File | null {
  const value = formData.get("image");
  return value instanceof File ? value : null;
}

function revalidate(id?: string) {
  revalidatePath("/admin/featured");
  if (id) revalidatePath(`/admin/featured/${id}`);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.featuredConcept.update({ where: { id }, data: { status } });
  revalidate(id);
}

export async function createFeatured(formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    title: s(formData, "title"),
    summary: s(formData, "summary") || undefined,
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "destinationUrl"));
  if (!parsed.success || !link.ok) {
    redirect("/admin/featured/new?error=validation");
  }

  let imageId: string | null = null;
  const file = imageField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "featured");
    if (!upload.ok) {
      redirect(`/admin/featured/new?error=image-${upload.error}`);
    }
    imageId = upload.mediaId;
  }

  const row = await prisma.featuredConcept.create({
    data: {
      title: parsed.data.title,
      summary: parsed.data.summary || null,
      destinationUrl: link.value,
      sortOrder: parsed.data.sortOrder,
      imageId,
      status: "DRAFT",
    },
  });

  revalidate();
  redirect(`/admin/featured/${row.id}`);
}

export async function updateFeatured(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    title: s(formData, "title"),
    summary: s(formData, "summary") || undefined,
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "destinationUrl"));
  if (!parsed.success || !link.ok) {
    redirect(`/admin/featured/${id}?error=validation`);
  }

  const data: {
    title: string;
    summary: string | null;
    destinationUrl: string | null;
    sortOrder: number;
    imageId?: string;
  } = {
    title: parsed.data.title,
    summary: parsed.data.summary || null,
    destinationUrl: link.value,
    sortOrder: parsed.data.sortOrder,
  };

  const file = imageField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "featured");
    if (!upload.ok) {
      redirect(`/admin/featured/${id}?error=image-${upload.error}`);
    }
    data.imageId = upload.mediaId;
  }

  await prisma.featuredConcept.update({ where: { id }, data });
  revalidate(id);
  redirect(`/admin/featured/${id}?saved=1`);
}

export async function publishFeatured(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/featured/${id}?saved=1`);
}

export async function unpublishFeatured(id: string) {
  await setStatus(id, "DRAFT");
  redirect(`/admin/featured/${id}?saved=1`);
}

export async function archiveFeatured(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/featured");
}
