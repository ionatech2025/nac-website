"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { optionalRichText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import type { ContentStatusValue } from "../../../lib/content-status";
import { slugify } from "../../../lib/slugify";
import { deleteMediaIfUnused } from "../../../lib/media-cleanup";
import { savePdfUpload } from "../../../lib/save-pdf-upload";

const docFields = z.object({
  title: z.string().trim().min(1).max(200),
  description: optionalRichText(5000),
  categoryId: z.string().trim().optional(),
  newCategoryName: z.string().trim().max(120).optional(),
});

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function fileField(formData: FormData): File | null {
  const value = formData.get("file");
  return value instanceof File ? value : null;
}

async function resolveCategoryId(
  categoryId: string | undefined,
  newCategoryName: string | undefined,
): Promise<string | null> {
  const name = newCategoryName?.trim();
  if (name) {
    const slug = slugify(name) || `category-${Date.now()}`;
    const created = await prisma.documentCategory.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });
    return created.id;
  }
  if (categoryId) return categoryId;
  return null;
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.document.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
}

export async function createDocument(formData: FormData) {
  await assertAdminSession();
  const parsed = docFields.safeParse({
    title: formString(formData, "title"),
    description: formString(formData, "description") || undefined,
    categoryId: formString(formData, "categoryId") || undefined,
    newCategoryName: formString(formData, "newCategoryName") || undefined,
  });
  if (!parsed.success) {
    redirect("/admin/documents/new?error=validation");
  }

  const upload = await savePdfUpload(fileField(formData));
  if (!upload.ok) {
    redirect(`/admin/documents/new?error=pdf-${upload.error}`);
  }

  const rawCategory = parsed.data.categoryId?.trim();
  const categoryId = await resolveCategoryId(
    rawCategory && /^[0-9a-f-]{36}$/i.test(rawCategory) ? rawCategory : undefined,
    parsed.data.newCategoryName,
  );

  const doc = await prisma.document.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      categoryId,
      mediaId: upload.mediaId,
      fileType: "application/pdf",
      byteSize: upload.byteSize,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${doc.id}`);
}

export async function updateDocument(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = docFields.safeParse({
    title: formString(formData, "title"),
    description: formString(formData, "description") || undefined,
    categoryId: formString(formData, "categoryId") || undefined,
    newCategoryName: formString(formData, "newCategoryName") || undefined,
  });
  if (!parsed.success) {
    redirect(`/admin/documents/${id}?error=validation`);
  }

  const rawCategory = parsed.data.categoryId?.trim();
  const categoryId = await resolveCategoryId(
    rawCategory && /^[0-9a-f-]{36}$/i.test(rawCategory) ? rawCategory : undefined,
    parsed.data.newCategoryName,
  );

  const data: {
    title: string;
    description: string | null;
    categoryId: string | null;
    mediaId?: string;
    byteSize?: number;
    fileType?: string;
  } = {
    title: parsed.data.title,
    description: parsed.data.description || null,
    categoryId,
  };

  let replacedMediaId: string | null = null;
  const file = fileField(formData);
  if (file && file.size > 0) {
    const upload = await savePdfUpload(file);
    if (!upload.ok) {
      redirect(`/admin/documents/${id}?error=pdf-${upload.error}`);
    }
    const current = await prisma.document.findUnique({
      where: { id },
      select: { mediaId: true },
    });
    replacedMediaId = current?.mediaId ?? null;
    data.mediaId = upload.mediaId;
    data.byteSize = upload.byteSize;
    data.fileType = "application/pdf";
  }

  await prisma.document.update({ where: { id }, data });
  await deleteMediaIfUnused([replacedMediaId]);
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  redirect(`/admin/documents/${id}?saved=1`);
}

export async function publishDocument(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/documents/${id}?saved=1`);
}

export async function unpublishDocument(id: string) {
  await assertAdminSession();
  await prisma.document.update({
    where: { id },
    data: { status: "DRAFT" },
  });
  revalidatePath("/admin/documents");
  revalidatePath(`/admin/documents/${id}`);
  redirect(`/admin/documents/${id}?saved=1`);
}

export async function archiveDocument(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/documents");
}
