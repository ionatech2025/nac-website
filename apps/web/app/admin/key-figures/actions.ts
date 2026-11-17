"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";

const figureSchema = z.object({
  label: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(120),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function fields(formData: FormData) {
  return figureSchema.safeParse({
    label: String(formData.get("label") ?? ""),
    value: String(formData.get("value") ?? ""),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
  });
}

export async function createKeyFigure(formData: FormData) {
  await assertAdminSession();
  const parsed = fields(formData);
  if (!parsed.success) {
    redirect("/admin/key-figures?error=validation");
  }
  await prisma.keyFigure.create({ data: parsed.data });
  revalidatePath("/admin/key-figures");
  redirect("/admin/key-figures?saved=1");
}

export async function updateKeyFigure(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = fields(formData);
  if (!parsed.success) {
    redirect(`/admin/key-figures?error=validation`);
  }
  await prisma.keyFigure.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/key-figures");
  redirect("/admin/key-figures?saved=1");
}

export async function deleteKeyFigure(id: string) {
  await assertAdminSession();
  await prisma.keyFigure.delete({ where: { id } });
  revalidatePath("/admin/key-figures");
  redirect("/admin/key-figures?saved=1");
}
