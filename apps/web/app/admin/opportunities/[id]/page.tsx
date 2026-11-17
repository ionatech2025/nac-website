import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { OpportunityForm } from "../opportunity-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditOpportunityPage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const [opportunity, types] = await Promise.all([
    prisma.opportunity.findUnique({
      where: { id },
      include: {
        type: true,
        attachments: {
          orderBy: { sortOrder: "asc" },
          include: {
            media: { select: { url: true, fileName: true, byteSize: true } },
          },
        },
      },
    }),
    prisma.opportunityType.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);
  if (!opportunity) {
    notFound();
  }

  return (
    <OpportunityForm
      opportunity={opportunity}
      types={types}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
