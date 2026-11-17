import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { DocumentForm } from "../document-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditDocumentPage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const [document, categories] = await Promise.all([
    prisma.document.findUnique({
      where: { id },
      include: {
        category: true,
        media: { select: { url: true, fileName: true } },
      },
    }),
    prisma.documentCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);
  if (!document) {
    notFound();
  }

  return (
    <DocumentForm
      document={document}
      categories={categories}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
