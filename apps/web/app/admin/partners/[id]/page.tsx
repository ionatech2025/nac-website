import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { PartnerForm } from "../partner-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditPartnerPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: { logo: { select: { url: true, altText: true } } },
  });
  if (!partner) {
    notFound();
  }

  return (
    <PartnerForm
      partner={partner}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
