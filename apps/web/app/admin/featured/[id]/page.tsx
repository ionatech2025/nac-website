import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { FeaturedForm } from "../featured-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditFeaturedPage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const concept = await prisma.featuredConcept.findUnique({
    where: { id },
    include: { image: { select: { url: true, altText: true } } },
  });
  if (!concept) {
    notFound();
  }

  return (
    <FeaturedForm
      concept={concept}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
