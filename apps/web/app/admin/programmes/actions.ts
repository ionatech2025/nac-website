"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { optionalRichText, richText, sanitizeRichText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import { slugify } from "../../../lib/slugify";
import type { ContentStatusValue } from "../../../lib/content-status";

const programmeFields = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(80),
  summary: optionalRichText(1000),
  body: richText(20000),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function parseStrategies(formData: FormData) {
  const titles = formData.getAll("strategyTitle").map(String);
  const bodies = formData.getAll("strategyBody").map(String);
  return titles
    .map((title, index) => ({
      title: title.trim().slice(0, 200),
      body: sanitizeRichText(bodies[index] ?? "").slice(0, 5000) || null,
      sortOrder: index,
    }))
    .filter((row) => row.title.length > 0);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.programme.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin/programmes");
  revalidatePath(`/admin/programmes/${id}`);
}

export async function createProgramme(formData: FormData) {
  await assertAdminSession();
  const title = formString(formData, "title");
  const slugRaw = formString(formData, "slug") || slugify(title);
  const parsed = programmeFields.safeParse({
    title,
    slug: slugify(slugRaw) || slugify(title),
    summary: formString(formData, "summary") || undefined,
    body: formString(formData, "body"),
    sortOrder: formString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) {
    redirect("/admin/programmes/new?error=validation");
  }

  const strategies = parseStrategies(formData);
  const programme = await prisma.programme.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary || null,
      body: parsed.data.body,
      sortOrder: parsed.data.sortOrder,
      status: "DRAFT",
      strategies: {
        create: strategies,
      },
    },
  });

  revalidatePath("/admin/programmes");
  redirect(`/admin/programmes/${programme.id}`);
}

export async function updateProgramme(id: string, formData: FormData) {
  await assertAdminSession();
  const title = formString(formData, "title");
  const slugRaw = formString(formData, "slug") || slugify(title);
  const parsed = programmeFields.safeParse({
    title,
    slug: slugify(slugRaw) || slugify(title),
    summary: formString(formData, "summary") || undefined,
    body: formString(formData, "body"),
    sortOrder: formString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) {
    redirect(`/admin/programmes/${id}?error=validation`);
  }

  const strategies = parseStrategies(formData);

  await prisma.$transaction([
    prisma.programmeStrategy.deleteMany({ where: { programmeId: id } }),
    prisma.programme.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        summary: parsed.data.summary || null,
        body: parsed.data.body,
        sortOrder: parsed.data.sortOrder,
        strategies: { create: strategies },
      },
    }),
  ]);

  revalidatePath("/admin/programmes");
  revalidatePath(`/admin/programmes/${id}`);
  redirect(`/admin/programmes/${id}?saved=1`);
}

export async function publishProgramme(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/programmes/${id}?saved=1`);
}

export async function unpublishProgramme(id: string) {
  await assertAdminSession();
  await prisma.programme.update({
    where: { id },
    data: { status: "DRAFT" },
  });
  revalidatePath("/admin/programmes");
  revalidatePath(`/admin/programmes/${id}`);
  redirect(`/admin/programmes/${id}?saved=1`);
}

export async function archiveProgramme(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/programmes");
}
