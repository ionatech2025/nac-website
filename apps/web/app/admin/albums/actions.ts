"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import { slugify } from "../../../lib/slugify";
import type { ContentStatusValue } from "../../../lib/content-status";

const fields = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(80),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function parseFields(formData: FormData) {
  const title = s(formData, "title");
  const slugRaw = s(formData, "slug") || slugify(title);
  return fields.safeParse({
    title,
    slug: slugify(slugRaw) || slugify(title),
    sortOrder: s(formData, "sortOrder") || "0",
  });
}

function revalidateAlbum(id?: string) {
  revalidatePath("/admin/albums");
  if (id) revalidatePath(`/admin/albums/${id}`);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.photoAlbum.update({ where: { id }, data: { status } });
  revalidateAlbum(id);
}

export async function createAlbum(formData: FormData) {
  await assertAdminSession();
  const parsed = parseFields(formData);
  if (!parsed.success) {
    redirect("/admin/albums/new?error=validation");
  }

  const album = await prisma.photoAlbum.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      sortOrder: parsed.data.sortOrder,
      status: "DRAFT",
    },
  });

  revalidateAlbum();
  redirect(`/admin/albums/${album.id}`);
}

export async function updateAlbum(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = parseFields(formData);
  if (!parsed.success) {
    redirect(`/admin/albums/${id}?error=validation`);
  }

  const coverMediaId = s(formData, "coverMediaId").trim() || null;

  await prisma.photoAlbum.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      sortOrder: parsed.data.sortOrder,
      coverMediaId,
    },
  });

  revalidateAlbum(id);
  redirect(`/admin/albums/${id}?saved=1`);
}

export async function publishAlbum(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/albums/${id}?saved=1`);
}

export async function unpublishAlbum(id: string) {
  await setStatus(id, "DRAFT");
  redirect(`/admin/albums/${id}?saved=1`);
}

export async function archiveAlbum(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/albums");
}
