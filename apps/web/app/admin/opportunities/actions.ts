"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@repo/database";
import { deleteMediaIfUnused } from "../../../lib/media-cleanup";
import { assertAdminSession } from "../../../lib/require-admin";
import {
  attachOpportunityPdfs,
  parseDate,
  parseOpportunityFields,
  resolveOpportunityTypeId,
} from "./opportunity-parse";

export async function createOpportunity(formData: FormData) {
  await assertAdminSession();
  const parsed = parseOpportunityFields(formData);
  if (!parsed.success) {
    redirect("/admin/opportunities/new?error=validation");
  }
  const typeId = await resolveOpportunityTypeId(
    parsed.data.typeId,
    parsed.data.newTypeName,
  );
  const opp = await prisma.opportunity.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      typeId,
      openingDate: parseDate(parsed.data.openingDate),
      closingDate: parseDate(parsed.data.closingDate),
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone || null,
      applicationInstructions: parsed.data.applicationInstructions || null,
      status: "DRAFT",
      manualStatus: "NONE",
    },
  });
  const attachError = await attachOpportunityPdfs(opp.id, formData);
  if (attachError) {
    redirect(`/admin/opportunities/${opp.id}?error=pdf-${attachError}`);
  }
  revalidatePath("/admin/opportunities");
  redirect(`/admin/opportunities/${opp.id}`);
}

export async function updateOpportunity(id: string, formData: FormData) {
  await assertAdminSession();
  const parsed = parseOpportunityFields(formData);
  if (!parsed.success) {
    redirect(`/admin/opportunities/${id}?error=validation`);
  }
  const typeId = await resolveOpportunityTypeId(
    parsed.data.typeId,
    parsed.data.newTypeName,
  );
  await prisma.opportunity.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      typeId,
      openingDate: parseDate(parsed.data.openingDate),
      closingDate: parseDate(parsed.data.closingDate),
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone || null,
      applicationInstructions: parsed.data.applicationInstructions || null,
    },
  });
  const attachError = await attachOpportunityPdfs(id, formData);
  if (attachError) {
    redirect(`/admin/opportunities/${id}?error=pdf-${attachError}`);
  }
  revalidatePath("/admin/opportunities");
  revalidatePath(`/admin/opportunities/${id}`);
  redirect(`/admin/opportunities/${id}?saved=1`);
}

export async function publishOpportunity(id: string) {
  await assertAdminSession();
  await prisma.opportunity.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });
  revalidatePath("/admin/opportunities");
  redirect(`/admin/opportunities/${id}?saved=1`);
}

export async function unpublishOpportunity(id: string) {
  await assertAdminSession();
  await prisma.opportunity.update({
    where: { id },
    data: { status: "DRAFT" },
  });
  revalidatePath("/admin/opportunities");
  redirect(`/admin/opportunities/${id}?saved=1`);
}

export async function closeOpportunityEarly(id: string) {
  await assertAdminSession();
  await prisma.opportunity.update({
    where: { id },
    data: { manualStatus: "CLOSED" },
  });
  revalidatePath("/admin/opportunities");
  redirect(`/admin/opportunities/${id}?saved=1`);
}

export async function reopenOpportunity(id: string) {
  await assertAdminSession();
  await prisma.opportunity.update({
    where: { id },
    data: { manualStatus: "NONE" },
  });
  revalidatePath("/admin/opportunities");
  redirect(`/admin/opportunities/${id}?saved=1`);
}

export async function archiveOpportunity(id: string) {
  await assertAdminSession();
  await prisma.opportunity.update({
    where: { id },
    data: { status: "ARCHIVED", manualStatus: "ARCHIVED" },
  });
  revalidatePath("/admin/opportunities");
  redirect("/admin/opportunities");
}

export async function removeAttachment(
  attachmentId: string,
  opportunityId: string,
) {
  await assertAdminSession();
  const removed = await prisma.opportunityAttachment.delete({
    where: { id: attachmentId },
    select: { mediaId: true },
  });
  await deleteMediaIfUnused([removed.mediaId]);
  revalidatePath(`/admin/opportunities/${opportunityId}`);
  redirect(`/admin/opportunities/${opportunityId}?saved=1`);
}
