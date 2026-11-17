"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma, SITE_SETTING_KEYS } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";

/** Empty string or a real http(s) URL — never a relative path. */
const optionalHttpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || /^https?:\/\//i.test(value), {
    error: "Links must start with http:// or https://",
  });

const contactSchema = z.object({
  physicalAddress: z.string().trim().max(500),
  postalAddress: z.string().trim().max(500),
  phone: z.string().trim().max(40),
  phoneAlt: z.string().trim().max(40),
  tollFree: z.string().trim().max(40),
  email: z
    .string()
    .trim()
    .max(200)
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      error: "Enter a valid email or leave blank",
    }),
  whatsapp: z.string().trim().max(200),
});

const socialSchema = z.object({
  facebook: optionalHttpUrl,
  x: optionalHttpUrl,
  instagram: optionalHttpUrl,
  youtube: optionalHttpUrl,
  linkedin: optionalHttpUrl,
  tiktok: optionalHttpUrl,
});

const externalSchema = z.object({
  youthGoBudget: optionalHttpUrl,
  slogbaa: optionalHttpUrl,
});

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function contactFrom(formData: FormData) {
  return contactSchema.safeParse({
    physicalAddress: text(formData, "physicalAddress"),
    postalAddress: text(formData, "postalAddress"),
    phone: text(formData, "phone"),
    phoneAlt: text(formData, "phoneAlt"),
    tollFree: text(formData, "tollFree"),
    email: text(formData, "email"),
    whatsapp: text(formData, "whatsapp"),
  });
}

function socialFrom(formData: FormData) {
  return socialSchema.safeParse({
    facebook: text(formData, "facebook"),
    x: text(formData, "x"),
    instagram: text(formData, "instagram"),
    youtube: text(formData, "youtube"),
    linkedin: text(formData, "linkedin"),
    tiktok: text(formData, "tiktok"),
  });
}

function externalFrom(formData: FormData) {
  return externalSchema.safeParse({
    youthGoBudget: text(formData, "youthGoBudget"),
    slogbaa: text(formData, "slogbaa"),
  });
}

async function upsert(key: string, value: object) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

function revalidatePublic() {
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  revalidatePath("/contact");
}

export async function saveContactSettings(formData: FormData) {
  await assertAdminSession();
  const parsed = contactFrom(formData);
  if (!parsed.success) redirect("/admin/settings?error=contact");
  await upsert(SITE_SETTING_KEYS.contact, parsed.data);
  revalidatePublic();
  redirect("/admin/settings?saved=contact");
}

export async function saveSocialSettings(formData: FormData) {
  await assertAdminSession();
  const parsed = socialFrom(formData);
  if (!parsed.success) redirect("/admin/settings?error=social");
  await upsert(SITE_SETTING_KEYS.social, parsed.data);
  revalidatePublic();
  redirect("/admin/settings?saved=social");
}

export async function saveExternalSettings(formData: FormData) {
  await assertAdminSession();
  const parsed = externalFrom(formData);
  if (!parsed.success) redirect("/admin/settings?error=external");
  await upsert(SITE_SETTING_KEYS.external, parsed.data);
  revalidatePublic();
  redirect("/admin/settings?saved=external");
}
