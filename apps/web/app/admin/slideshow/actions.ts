"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import type { ContentStatusValue } from "../../../lib/content-status";
import { parseOptionalHref } from "../../../lib/cms-link";
import { saveImageUpload } from "../../../lib/save-image-upload";

const fields = z.object({
  caption: z.string().trim().max(500).optional(),
  altText: z.string().trim().max(300).optional(),
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
  revalidatePath("/admin/slideshow");
  if (id) revalidatePath(`/admin/slideshow/${id}`);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.slideshowImage.update({ where: { id }, data: { status } });
  revalidate(id);
}

export async function createSlide(formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    caption: s(formData, "caption") || undefined,
    altText: s(formData, "altText") || undefined,
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "destinationUrl"));
  if (!parsed.success || !link.ok) {
    redirect("/admin/slideshow/new?error=validation");
  }

  const upload = await saveImageUpload(imageField(formData), "slideshow", {
    required: true,
  });
  if (!upload.ok) {
    redirect(`/admin/slideshow/new?error=image-${upload.error}`);
  }

  const slide = await prisma.slideshowImage.create({
    data: {
      mediaId: upload.mediaId,
      caption: parsed.data.caption || null,
      altText: parsed.data.altText || null,
      destinationUrl: link.value,
      sortOrder: parsed.data.sortOrder,
      status: "DRAFT",
    },
  });

  revalidate();
  redirect(`/admin/slideshow/${slide.id}`);
}

export async function updateSlide(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    caption: s(formData, "caption") || undefined,
    altText: s(formData, "altText") || undefined,
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "destinationUrl"));
  if (!parsed.success || !link.ok) {
    redirect(`/admin/slideshow/${id}?error=validation`);
  }

  const data: {
    caption: string | null;
    altText: string | null;
    destinationUrl: string | null;
    sortOrder: number;
    mediaId?: string;
  } = {
    caption: parsed.data.caption || null,
    altText: parsed.data.altText || null,
    destinationUrl: link.value,
    sortOrder: parsed.data.sortOrder,
  };

  const file = imageField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "slideshow");
    if (!upload.ok) {
      redirect(`/admin/slideshow/${id}?error=image-${upload.error}`);
    }
    data.mediaId = upload.mediaId;
  }

  await prisma.slideshowImage.update({ where: { id }, data });
  revalidate(id);
  redirect(`/admin/slideshow/${id}?saved=1`);
}

export async function publishSlide(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/slideshow/${id}?saved=1`);
}

export async function unpublishSlide(id: string) {
  await setStatus(id, "DRAFT");
  redirect(`/admin/slideshow/${id}?saved=1`);
}

export async function archiveSlide(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/slideshow");
}
