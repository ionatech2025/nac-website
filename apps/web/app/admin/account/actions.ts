"use server";

import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@repo/database";
import { signOut } from "../../../auth";
import { assertAdminSession } from "../../../lib/require-admin";

const BCRYPT_COST = 12;

const emailSchema = z.object({
  email: z.string().trim().max(254).email(),
  currentPassword: z.string().min(1).max(200),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z.string().min(10).max(200),
    confirmPassword: z.string().min(1).max(200),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "mismatch",
  });

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

async function loadAdmin(id: string) {
  return prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, email: true, passwordHash: true },
  });
}

export async function updateAdminEmail(formData: FormData) {
  const session = await assertAdminSession();
  const parsed = emailSchema.safeParse({
    email: s(formData, "email"),
    currentPassword: s(formData, "currentPassword"),
  });
  if (!parsed.success) redirect("/admin/account?error=email-validation");

  const admin = await loadAdmin(session.user.id);
  if (!admin) redirect("/login");

  const ok = await compare(parsed.data.currentPassword, admin.passwordHash);
  if (!ok) redirect("/admin/account?error=current-password");

  const email = parsed.data.email.toLowerCase();
  if (email === admin.email) redirect("/admin/account?saved=email");

  try {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { email },
    });
  } catch (err) {
    if ((err as { code?: string }).code === "P2002") {
      redirect("/admin/account?error=email-taken");
    }
    throw err;
  }

  // Session JWT still holds the old email — force a fresh sign-in.
  await signOut({ redirect: false });
  redirect("/login?notice=EmailChanged");
}

export async function updateAdminPassword(formData: FormData) {
  const session = await assertAdminSession();
  const parsed = passwordSchema.safeParse({
    currentPassword: s(formData, "currentPassword"),
    newPassword: s(formData, "newPassword"),
    confirmPassword: s(formData, "confirmPassword"),
  });
  if (!parsed.success) {
    const mismatch = parsed.error.issues.some((i) => i.path[0] === "confirmPassword");
    redirect(
      mismatch
        ? "/admin/account?error=password-mismatch"
        : "/admin/account?error=password-validation",
    );
  }

  const admin = await loadAdmin(session.user.id);
  if (!admin) redirect("/login");

  const ok = await compare(parsed.data.currentPassword, admin.passwordHash);
  if (!ok) redirect("/admin/account?error=current-password");

  const passwordHash = await hash(parsed.data.newPassword, BCRYPT_COST);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  revalidatePath("/admin/account");
  redirect("/admin/account?saved=password");
}
