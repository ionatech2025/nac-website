"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { optionalRichText, richText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import type { ContentStatusValue } from "../../../lib/content-status";
import { slugify } from "../../../lib/slugify";
import { saveImageUpload } from "../../../lib/save-image-upload";

const articleFields = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(80),
  excerpt: optionalRichText(1000),
  body: richText(100000),
  author: z.string().trim().max(120).optional(),
  seoTitle: z.string().trim().max(200).optional(),
  seoDescription: z.string().trim().max(500).optional(),
});

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function fileField(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}

function parseFields(formData: FormData) {
  const title = formString(formData, "title");
  const slugRaw = formString(formData, "slug") || slugify(title);
  return articleFields.safeParse({
    title,
    slug: slugify(slugRaw) || slugify(title),
    excerpt: formString(formData, "excerpt") || undefined,
    body: formString(formData, "body"),
    author: formString(formData, "author") || undefined,
    seoTitle: formString(formData, "seoTitle") || undefined,
    seoDescription: formString(formData, "seoDescription") || undefined,
  });
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.article.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
}

export async function createArticle(formData: FormData) {
  await assertAdminSession();
  const parsed = parseFields(formData);
  if (!parsed.success) {
    redirect("/admin/articles/new?error=validation");
  }

  const cover = await saveImageUpload(fileField(formData, "coverImage"), "articles", {
    required: true,
  });
  if (!cover.ok) {
    redirect(`/admin/articles/new?error=cover-${cover.error}`);
  }

  let ogImageId: string | undefined;
  const ogFile = fileField(formData, "ogImage");
  if (ogFile && ogFile.size > 0) {
    const og = await saveImageUpload(ogFile, "articles-og");
    if (!og.ok) {
      redirect(`/admin/articles/new?error=og-${og.error}`);
    }
    ogImageId = og.mediaId;
  }

  const article = await prisma.article.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      author: parsed.data.author || null,
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      coverImageId: cover.mediaId,
      ogImageId: ogImageId ?? null,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${article.id}`);
}

export async function updateArticle(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = parseFields(formData);
  if (!parsed.success) {
    redirect(`/admin/articles/${id}?error=validation`);
  }

  const data: {
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    author: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    coverImageId?: string;
    ogImageId?: string;
  } = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    body: parsed.data.body,
    author: parsed.data.author || null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
  };

  const coverFile = fileField(formData, "coverImage");
  if (coverFile && coverFile.size > 0) {
    const cover = await saveImageUpload(coverFile, "articles");
    if (!cover.ok) {
      redirect(`/admin/articles/${id}?error=cover-${cover.error}`);
    }
    data.coverImageId = cover.mediaId;
  }

  const ogFile = fileField(formData, "ogImage");
  if (ogFile && ogFile.size > 0) {
    const og = await saveImageUpload(ogFile, "articles-og");
    if (!og.ok) {
      redirect(`/admin/articles/${id}?error=og-${og.error}`);
    }
    data.ogImageId = og.mediaId;
  }

  await prisma.article.update({ where: { id }, data });
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function publishArticle(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function unpublishArticle(id: string) {
  await assertAdminSession();
  await prisma.article.update({
    where: { id },
    data: { status: "DRAFT" },
  });
  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function archiveArticle(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/articles");
}
