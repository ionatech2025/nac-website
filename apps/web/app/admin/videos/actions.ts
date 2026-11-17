"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { optionalRichText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import type { ContentStatusValue } from "../../../lib/content-status";
import { parseVideoUrl } from "../../../lib/video-provider";
import { saveImageUpload } from "../../../lib/save-image-upload";

const fields = z.object({
  title: z.string().trim().min(1).max(200),
  description: optionalRichText(5000),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function fileField(formData: FormData): File | null {
  const value = formData.get("thumbnail");
  return value instanceof File ? value : null;
}

function revalidateVideo(id?: string) {
  revalidatePath("/admin/videos");
  if (id) revalidatePath(`/admin/videos/${id}`);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.videoLink.update({ where: { id }, data: { status } });
  revalidateVideo(id);
}

export async function createVideo(formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    title: s(formData, "title"),
    description: s(formData, "description") || undefined,
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const video = parseVideoUrl(s(formData, "url"));
  if (!parsed.success) {
    redirect("/admin/videos/new?error=validation");
  }
  if (!video.ok) {
    redirect(`/admin/videos/new?error=url-${video.error}`);
  }

  let thumbnailMediaId: string | null = null;
  const file = fileField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "videos");
    if (!upload.ok) {
      redirect(`/admin/videos/new?error=image-${upload.error}`);
    }
    thumbnailMediaId = upload.mediaId;
  }

  const row = await prisma.videoLink.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      provider: video.provider,
      url: video.url,
      sortOrder: parsed.data.sortOrder,
      thumbnailMediaId,
      status: "DRAFT",
    },
  });

  revalidateVideo();
  redirect(`/admin/videos/${row.id}`);
}

export async function updateVideo(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    title: s(formData, "title"),
    description: s(formData, "description") || undefined,
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const video = parseVideoUrl(s(formData, "url"));
  if (!parsed.success) {
    redirect(`/admin/videos/${id}?error=validation`);
  }
  if (!video.ok) {
    redirect(`/admin/videos/${id}?error=url-${video.error}`);
  }

  const data: {
    title: string;
    description: string | null;
    provider: "YOUTUBE" | "VIMEO";
    url: string;
    sortOrder: number;
    thumbnailMediaId?: string;
  } = {
    title: parsed.data.title,
    description: parsed.data.description || null,
    provider: video.provider,
    url: video.url,
    sortOrder: parsed.data.sortOrder,
  };

  const file = fileField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "videos");
    if (!upload.ok) {
      redirect(`/admin/videos/${id}?error=image-${upload.error}`);
    }
    data.thumbnailMediaId = upload.mediaId;
  }

  await prisma.videoLink.update({ where: { id }, data });
  revalidateVideo(id);
  redirect(`/admin/videos/${id}?saved=1`);
}

export async function publishVideo(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/videos/${id}?saved=1`);
}

export async function unpublishVideo(id: string) {
  await setStatus(id, "DRAFT");
  redirect(`/admin/videos/${id}?saved=1`);
}

export async function archiveVideo(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/videos");
}
