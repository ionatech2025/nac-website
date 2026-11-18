import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { DocumentForm } from "../document-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewDocumentPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const categories = await prisma.documentCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return <DocumentForm categories={categories} error={params.error} />;
}
