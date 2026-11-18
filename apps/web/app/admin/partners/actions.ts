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
  name: z.string().trim().min(1).max(200),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function logoField(formData: FormData): File | null {
  const value = formData.get("logo");
  return value instanceof File ? value : null;
}

function revalidate(id?: string) {
  revalidatePath("/admin/partners");
  if (id) revalidatePath(`/admin/partners/${id}`);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  await prisma.partner.update({ where: { id }, data: { status } });
  revalidate(id);
}

export async function createPartner(formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    name: s(formData, "name"),
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "websiteUrl"));
  if (!parsed.success || !link.ok) {
    redirect("/admin/partners/new?error=validation");
  }

  const upload = await saveImageUpload(logoField(formData), "partners", {
    required: true,
  });
  if (!upload.ok) {
    redirect(`/admin/partners/new?error=logo-${upload.error}`);
  }

  const partner = await prisma.partner.create({
    data: {
      name: parsed.data.name,
      websiteUrl: link.value,
      sortOrder: parsed.data.sortOrder,
      logoId: upload.mediaId,
      status: "DRAFT",
    },
  });

  revalidate();
  redirect(`/admin/partners/${partner.id}`);
}

export async function updatePartner(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = fields.safeParse({
    name: s(formData, "name"),
    sortOrder: s(formData, "sortOrder") || "0",
  });
  const link = parseOptionalHref(s(formData, "websiteUrl"));
  if (!parsed.success || !link.ok) {
    redirect(`/admin/partners/${id}?error=validation`);
  }

  const data: {
    name: string;
    websiteUrl: string | null;
    sortOrder: number;
    logoId?: string;
  } = {
    name: parsed.data.name,
    websiteUrl: link.value,
    sortOrder: parsed.data.sortOrder,
  };

  const file = logoField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "partners");
    if (!upload.ok) {
      redirect(`/admin/partners/${id}?error=logo-${upload.error}`);
    }
    data.logoId = upload.mediaId;
  }

  await prisma.partner.update({ where: { id }, data });
  revalidate(id);
  redirect(`/admin/partners/${id}?saved=1`);
}

export async function publishPartner(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/partners/${id}?saved=1`);
}

export async function unpublishPartner(id: string) {
  await setStatus(id, "DRAFT");
  redirect(`/admin/partners/${id}?saved=1`);
}

export async function archivePartner(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/partners");
}
