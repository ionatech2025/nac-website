import { z } from "zod";
import { richText } from "../../../lib/rich-text";
import { prisma } from "@repo/database";
import { slugify } from "../../../lib/slugify";
import { savePdfUpload } from "../../../lib/save-pdf-upload";

export const opportunityFields = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(80),
  description: richText(50000),
  typeId: z.string().trim().optional(),
  newTypeName: z.string().trim().max(120).optional(),
  openingDate: z.string().trim().optional(),
  closingDate: z.string().trim().optional(),
  contactEmail: z.string().trim().email(),
  contactPhone: z.string().trim().max(40).optional(),
  applicationInstructions: z.string().trim().max(5000).optional(),
});

export function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

export function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseOpportunityFields(formData: FormData) {
  const title = formString(formData, "title");
  const slugRaw = formString(formData, "slug") || slugify(title);
  return opportunityFields.safeParse({
    title,
    slug: slugify(slugRaw) || slugify(title),
    description: formString(formData, "description"),
    typeId: formString(formData, "typeId") || undefined,
    newTypeName: formString(formData, "newTypeName") || undefined,
    openingDate: formString(formData, "openingDate") || undefined,
    closingDate: formString(formData, "closingDate") || undefined,
    contactEmail: formString(formData, "contactEmail"),
    contactPhone: formString(formData, "contactPhone") || undefined,
    applicationInstructions:
      formString(formData, "applicationInstructions") || undefined,
  });
}

export async function resolveOpportunityTypeId(
  typeId: string | undefined,
  newTypeName: string | undefined,
): Promise<string | null> {
  const name = newTypeName?.trim();
  if (name) {
    const slug = slugify(name) || `type-${Date.now()}`;
    const row = await prisma.opportunityType.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });
    return row.id;
  }
  if (typeId && /^[0-9a-f-]{36}$/i.test(typeId)) return typeId;
  return null;
}

export async function attachOpportunityPdfs(
  opportunityId: string,
  formData: FormData,
) {
  const files = formData
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);
  let sortOrder = await prisma.opportunityAttachment.count({
    where: { opportunityId },
  });
  for (const file of files) {
    const upload = await savePdfUpload(file, "opportunity-attachments");
    if (!upload.ok) return upload.error;
    await prisma.opportunityAttachment.create({
      data: {
        opportunityId,
        mediaId: upload.mediaId,
        title: file.name,
        sortOrder,
      },
    });
    sortOrder += 1;
  }
  return null;
}
