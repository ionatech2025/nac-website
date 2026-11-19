"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";

function refresh(id?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/inquiries");
  if (id) revalidatePath(`/admin/inquiries/${id}`);
}

export async function markInquiryUnread(id: string) {
  await assertAdminSession();
  await prisma.inquiry.update({ where: { id }, data: { isRead: false } });
  refresh(id);
  redirect("/admin/inquiries?done=unread");
}

export async function archiveInquiry(id: string) {
  await assertAdminSession();
  await prisma.inquiry.update({
    where: { id },
    data: { isArchived: true, isRead: true },
  });
  refresh(id);
  redirect("/admin/inquiries?done=archived");
}

export async function unarchiveInquiry(id: string) {
  await assertAdminSession();
  await prisma.inquiry.update({ where: { id }, data: { isArchived: false } });
  refresh(id);
}

export async function deleteInquiry(id: string) {
  await assertAdminSession();
  await prisma.inquiry.delete({ where: { id } });
  refresh();
  redirect("/admin/inquiries?done=deleted");
}

export async function markAllInquiriesRead() {
  await assertAdminSession();
  await prisma.inquiry.updateMany({
    where: { isRead: false, isArchived: false },
    data: { isRead: true },
  });
  refresh();
}
