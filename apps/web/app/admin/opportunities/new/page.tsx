import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { OpportunityForm } from "../opportunity-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewOpportunityPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const types = await prisma.opportunityType.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return <OpportunityForm types={types} error={params.error} />;
}
