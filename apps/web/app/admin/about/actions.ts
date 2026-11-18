"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { richText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { ABOUT_PAGE_KEY } from "../../../lib/about-content";
import { assertAdminSession } from "../../../lib/require-admin";

const aboutSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: richText(50000),
});

export async function saveAboutPage(formData: FormData) {
  await assertAdminSession();
  const parsed = aboutSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  if (!parsed.success) {
    redirect("/admin/about?error=validation");
  }

  await prisma.pageContent.upsert({
    where: { key: ABOUT_PAGE_KEY },
    create: {
      key: ABOUT_PAGE_KEY,
      title: parsed.data.title,
      body: parsed.data.body,
    },
    update: {
      title: parsed.data.title,
      body: parsed.data.body,
    },
  });

  revalidatePath("/admin/about");
  redirect("/admin/about?saved=1");
}
