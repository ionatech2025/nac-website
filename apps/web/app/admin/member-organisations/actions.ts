"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { parseOptionalHref } from "../../../lib/cms-link";
import type { ContentStatusValue } from "../../../lib/content-status";
import { richText } from "../../../lib/rich-text";
import { assertAdminSession } from "../../../lib/require-admin";
import { slugify } from "../../../lib/slugify";

const fields = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(80),
  bio: richText(5000),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string }).code === "P2002";
}

function revalidate(id?: string, slug?: string) {
  revalidatePath("/admin/member-organisations");
  if (id) revalidatePath(`/admin/member-organisations/${id}`);
  revalidatePath("/member-organisations");
  if (slug) revalidatePath(`/member-organisations/${slug}`);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  const row = await prisma.memberOrganisation.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
    select: { slug: true },
  });
  revalidate(id, row.slug);
}

export async function createMemberOrganisation(formData: FormData) {
  await assertAdminSession();
  const name = s(formData, "name");
  const slugRaw = s(formData, "slug") || slugify(name);
  const parsed = fields.safeParse({
    name,
    slug: slugify(slugRaw) || slugify(name),
    bio: s(formData, "bio"),
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "websiteUrl"));
  if (!parsed.success || !link.ok) {
    redirect("/admin/member-organisations/new?error=validation");
  }

  let id: string;
  let slug: string;
  try {
    const org = await prisma.memberOrganisation.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        bio: parsed.data.bio,
        websiteUrl: link.value,
        sortOrder: parsed.data.sortOrder,
        status: "DRAFT",
      },
    });
    id = org.id;
    slug = org.slug;
  } catch (err) {
    if (isUniqueViolation(err)) redirect("/admin/member-organisations/new?error=slug");
    throw err;
  }

  revalidate(id, slug);
  redirect(`/admin/member-organisations/${id}`);
}

export async function updateMemberOrganisation(id: string, formData: FormData) {
  await assertAdminSession();
  const name = s(formData, "name");
  const slugRaw = s(formData, "slug") || slugify(name);
  const parsed = fields.safeParse({
    name,
    slug: slugify(slugRaw) || slugify(name),
    bio: s(formData, "bio"),
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "websiteUrl"));
  if (!parsed.success || !link.ok) {
    redirect(`/admin/member-organisations/${id}?error=validation`);
  }

  let slug: string;
  try {
    const org = await prisma.memberOrganisation.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        bio: parsed.data.bio,
        websiteUrl: link.value,
        sortOrder: parsed.data.sortOrder,
      },
      select: { slug: true },
    });
    slug = org.slug;
  } catch (err) {
    if (isUniqueViolation(err)) {
      redirect(`/admin/member-organisations/${id}?error=slug`);
    }
    throw err;
  }

  revalidate(id, slug);
  redirect(`/admin/member-organisations/${id}?saved=1`);
}

export async function publishMemberOrganisation(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/member-organisations/${id}?saved=1`);
}

export async function unpublishMemberOrganisation(id: string) {
  await assertAdminSession();
  const org = await prisma.memberOrganisation.update({
    where: { id },
    data: { status: "DRAFT" },
    select: { slug: true },
  });
  revalidate(id, org.slug);
  redirect(`/admin/member-organisations/${id}?saved=1`);
}

export async function archiveMemberOrganisation(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/member-organisations");
}
