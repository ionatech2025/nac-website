"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { richText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { assertAdminSession } from "../../../lib/require-admin";
import {
  DEFAULT_EVENT_TIMEZONE,
  parseKampalaDateTimeLocal,
} from "../../../lib/kampala-datetime";
import { slugify } from "../../../lib/slugify";
import { saveImageUpload } from "../../../lib/save-image-upload";

const fields = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(80),
  description: richText(50000),
  startAt: z.string().trim().min(1),
  endAt: z.string().trim().min(1),
  location: z.string().trim().max(300).optional(),
  registrationUrl: z.string().trim().url().optional().or(z.literal("")),
  contact: z.string().trim().max(300).optional(),
});

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function fileField(formData: FormData): File | null {
  const value = formData.get("image");
  return value instanceof File ? value : null;
}

function parseFields(formData: FormData) {
  const title = s(formData, "title");
  const slugRaw = s(formData, "slug") || slugify(title);
  return fields.safeParse({
    title,
    slug: slugify(slugRaw) || slugify(title),
    description: s(formData, "description"),
    startAt: s(formData, "startAt"),
    endAt: s(formData, "endAt"),
    location: s(formData, "location") || undefined,
    registrationUrl: s(formData, "registrationUrl") || undefined,
    contact: s(formData, "contact") || undefined,
  });
}

function parseTimes(startRaw: string, endRaw: string) {
  const startAt = parseKampalaDateTimeLocal(startRaw);
  const endAt = parseKampalaDateTimeLocal(endRaw);
  if (!startAt || !endAt || endAt < startAt) return null;
  return { startAt, endAt };
}

export async function createEvent(formData: FormData) {
  await assertAdminSession();
  const parsed = parseFields(formData);
  if (!parsed.success) {
    redirect("/admin/events/new?error=validation");
  }
  const times = parseTimes(parsed.data.startAt, parsed.data.endAt);
  if (!times) {
    redirect("/admin/events/new?error=dates");
  }

  let imageId: string | null = null;
  const file = fileField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "events");
    if (!upload.ok) {
      redirect(`/admin/events/new?error=image-${upload.error}`);
    }
    imageId = upload.mediaId;
  }

  const event = await prisma.event.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      startAt: times.startAt,
      endAt: times.endAt,
      timezone: DEFAULT_EVENT_TIMEZONE,
      location: parsed.data.location || null,
      registrationUrl: parsed.data.registrationUrl || null,
      contact: parsed.data.contact || null,
      imageId,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEvent(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = parseFields(formData);
  if (!parsed.success) {
    redirect(`/admin/events/${id}?error=validation`);
  }
  const times = parseTimes(parsed.data.startAt, parsed.data.endAt);
  if (!times) {
    redirect(`/admin/events/${id}?error=dates`);
  }

  const data: {
    title: string;
    slug: string;
    description: string;
    startAt: Date;
    endAt: Date;
    timezone: string;
    location: string | null;
    registrationUrl: string | null;
    contact: string | null;
    imageId?: string;
  } = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    startAt: times.startAt,
    endAt: times.endAt,
    timezone: DEFAULT_EVENT_TIMEZONE,
    location: parsed.data.location || null,
    registrationUrl: parsed.data.registrationUrl || null,
    contact: parsed.data.contact || null,
  };

  const file = fileField(formData);
  if (file && file.size > 0) {
    const upload = await saveImageUpload(file, "events");
    if (!upload.ok) {
      redirect(`/admin/events/${id}?error=image-${upload.error}`);
    }
    data.imageId = upload.mediaId;
  }

  await prisma.event.update({ where: { id }, data });
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  redirect(`/admin/events/${id}?saved=1`);
}

export async function publishEvent(id: string) {
  await assertAdminSession();
  await prisma.event.update({ where: { id }, data: { status: "PUBLISHED" } });
  revalidatePath("/admin/events");
  redirect(`/admin/events/${id}?saved=1`);
}

export async function unpublishEvent(id: string) {
  await assertAdminSession();
  await prisma.event.update({ where: { id }, data: { status: "DRAFT" } });
  revalidatePath("/admin/events");
  redirect(`/admin/events/${id}?saved=1`);
}

export async function cancelEvent(id: string) {
  await assertAdminSession();
  await prisma.event.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/admin/events");
  redirect(`/admin/events/${id}?saved=1`);
}

export async function archiveEvent(id: string) {
  await assertAdminSession();
  await prisma.event.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/events");
  redirect("/admin/events");
}
