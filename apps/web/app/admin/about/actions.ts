"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ensureAboutPage, prisma } from "@repo/database";
import { optionalRichText, richText } from "../../../lib/rich-text";
import { assertAdminSession } from "../../../lib/require-admin";

const aboutSchema = z.object({
  title: z.string().trim().min(1).max(200),
  mission: richText(20000),
  vision: richText(20000),
  whatWeDo: richText(20000),
  why: optionalRichText(20000),
});

export async function saveAboutPage(formData: FormData) {
  await assertAdminSession();
  await ensureAboutPage();
  const parsed = aboutSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    mission: String(formData.get("mission") ?? ""),
    vision: String(formData.get("vision") ?? ""),
    whatWeDo: String(formData.get("whatWeDo") ?? ""),
    why: String(formData.get("why") ?? "") || undefined,
  });
  if (!parsed.success) {
    redirect("/admin/about?error=validation");
  }

  await prisma.aboutPage.update({
    where: { id: "about" },
    data: {
      title: parsed.data.title,
      mission: parsed.data.mission,
      vision: parsed.data.vision,
      whatWeDo: parsed.data.whatWeDo,
      why: parsed.data.why || "",
    },
  });

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}
