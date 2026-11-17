"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { richText } from "../../../lib/rich-text";
import { loadStarterYouthSpaces, prisma } from "@repo/database";
import type { ContentStatusValue } from "../../../lib/content-status";
import { assertAdminSession } from "../../../lib/require-admin";
import { slugify } from "../../../lib/slugify";

const spaceFields = z.object({
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(80),
  regionId: z.uuid(),
  location: z.string().trim().max(200).optional(),
  managingPartner: z.string().trim().max(300).optional(),
  description: richText(5000),
  services: z.array(z.string().trim().min(1).max(200)).max(20),
  mapUrl: z.url({ protocol: /^https?$/ }).max(1000).optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function text(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

function parseSpace(formData: FormData) {
  const name = text(formData, "name") ?? "";
  const services = String(formData.get("services") ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  const parsed = spaceFields.safeParse({
    name,
    slug: slugify(text(formData, "slug") ?? name),
    regionId: text(formData, "regionId"),
    location: text(formData, "location"),
    managingPartner: text(formData, "managingPartner"),
    description: text(formData, "description"),
    services,
    mapUrl: text(formData, "mapUrl"),
    sortOrder: text(formData, "sortOrder") ?? "0",
  });
  if (!parsed.success) return null;
  const d = parsed.data;
  return {
    ...d,
    location: d.location ?? null,
    managingPartner: d.managingPartner ?? null,
    mapUrl: d.mapUrl ?? null,
  };
}

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string }).code === "P2002";
}

async function revalidateSpace(id: string, slug?: string) {
  revalidatePath("/admin/youth-spaces");
  revalidatePath(`/admin/youth-spaces/${id}`);
  revalidatePath("/youth-spaces");
  if (slug) revalidatePath(`/youth-spaces/${slug}`);
}

export async function createYouthSpace(formData: FormData) {
  await assertAdminSession();
  const data = parseSpace(formData);
  if (!data) redirect("/admin/youth-spaces/new?error=validation");

  let id: string;
  try {
    const space = await prisma.youthSpace.create({ data: { ...data, status: "DRAFT" } });
    id = space.id;
  } catch (err) {
    if (isUniqueViolation(err)) redirect("/admin/youth-spaces/new?error=slug");
    throw err;
  }
  await revalidateSpace(id, data.slug);
  redirect(`/admin/youth-spaces/${id}?saved=1`);
}

export async function updateYouthSpace(id: string, formData: FormData) {
  await assertAdminSession();
  const data = parseSpace(formData);
  if (!data) redirect(`/admin/youth-spaces/${id}?error=validation`);

  const before = await prisma.youthSpace.findUnique({ where: { id }, select: { slug: true } });
  try {
    await prisma.youthSpace.update({ where: { id }, data });
  } catch (err) {
    if (isUniqueViolation(err)) redirect(`/admin/youth-spaces/${id}?error=slug`);
    throw err;
  }
  await revalidateSpace(id, data.slug);
  if (before && before.slug !== data.slug) revalidatePath(`/youth-spaces/${before.slug}`);
  redirect(`/admin/youth-spaces/${id}?saved=1`);
}

async function setStatus(id: string, status: ContentStatusValue) {
  await assertAdminSession();
  const space = await prisma.youthSpace.update({
    where: { id },
    data: { status },
    select: { slug: true },
  });
  await revalidateSpace(id, space.slug);
}

export async function publishYouthSpace(id: string) {
  await setStatus(id, "PUBLISHED");
  redirect(`/admin/youth-spaces/${id}?saved=1`);
}

export async function unpublishYouthSpace(id: string) {
  await setStatus(id, "DRAFT");
  redirect(`/admin/youth-spaces/${id}?saved=1`);
}

export async function archiveYouthSpace(id: string) {
  await setStatus(id, "ARCHIVED");
  redirect("/admin/youth-spaces");
}

export async function loadStarterSpaces() {
  await assertAdminSession();
  const result = await loadStarterYouthSpaces(prisma);
  revalidatePath("/admin/youth-spaces");
  revalidatePath("/admin/youth-spaces/regions");
  redirect(`/admin/youth-spaces?done=starter-${result.spaces}`);
}
