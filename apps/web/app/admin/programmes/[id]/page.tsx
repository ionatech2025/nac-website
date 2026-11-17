import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { ProgrammeForm } from "../programme-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditProgrammePage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const programme = await prisma.programme.findUnique({
    where: { id },
    include: { strategies: { orderBy: { sortOrder: "asc" } } },
  });
  if (!programme) {
    notFound();
  }

  return (
    <ProgrammeForm
      programme={programme}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
