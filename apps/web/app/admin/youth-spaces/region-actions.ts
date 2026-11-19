"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";

const BASE = "/admin/youth-spaces/regions";

const regionFields = z.object({
  name: z.string().trim().min(1).max(80),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function parse(formData: FormData) {
  return regionFields.safeParse({
    name: String(formData.get("name") ?? ""),
    sortOrder: String(formData.get("sortOrder") ?? "") || "0",
  });
}

function refresh() {
  revalidatePath(BASE);
  revalidatePath("/admin/youth-spaces");
  revalidatePath("/youth-spaces");
}

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string }).code === "P2002";
}

export async function createRegion(formData: FormData) {
  await assertAdminSession();
  const parsed = parse(formData);
  if (!parsed.success) redirect(`${BASE}?error=validation`);
  try {
    await prisma.youthRegion.create({ data: parsed.data });
  } catch (err) {
    if (isUniqueViolation(err)) redirect(`${BASE}?error=duplicate`);
    throw err;
  }
  refresh();
  redirect(`${BASE}?done=created`);
}

export async function updateRegion(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = parse(formData);
  if (!parsed.success) redirect(`${BASE}?error=validation`);
  try {
    await prisma.youthRegion.update({ where: { id }, data: parsed.data });
  } catch (err) {
    if (isUniqueViolation(err)) redirect(`${BASE}?error=duplicate`);
    throw err;
  }
  refresh();
  redirect(`${BASE}?done=saved`);
}

/** Only empty regions can go — spaces must be moved to another region first. */
export async function deleteRegion(id: string) {
  await assertAdminSession();
  const spaces = await prisma.youthSpace.count({ where: { regionId: id } });
  if (spaces > 0) redirect(`${BASE}?error=not-empty`);
  await prisma.youthRegion.delete({ where: { id } });
  refresh();
  redirect(`${BASE}?done=deleted`);
}
