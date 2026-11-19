"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { type ComplaintStatus, prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";

const statusSchema = z.enum(["NEW", "REVIEWED", "CLOSED"]);
const notesSchema = z.string().trim().max(5000);

function refresh(id?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/complaints");
  if (id) revalidatePath(`/admin/complaints/${id}`);
}

export async function setComplaintStatus(id: string, status: ComplaintStatus) {
  await assertAdminSession();
  const parsed = statusSchema.parse(status);
  await prisma.complaint.update({ where: { id }, data: { status: parsed } });
  refresh(id);
  redirect(`/admin/complaints/${id}?saved=status`);
}

export async function saveComplaintNotes(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = notesSchema.safeParse(String(formData.get("adminNotes") ?? ""));
  if (!parsed.success) {
    redirect(`/admin/complaints/${id}?error=notes`);
  }
  await prisma.complaint.update({
    where: { id },
    data: { adminNotes: parsed.data || null },
  });
  refresh(id);
  redirect(`/admin/complaints/${id}?saved=notes`);
}

export async function deleteComplaint(id: string) {
  await assertAdminSession();
  await prisma.complaint.delete({ where: { id } });
  refresh();
  redirect("/admin/complaints?done=deleted");
}
