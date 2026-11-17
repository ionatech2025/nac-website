import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { SlideForm } from "../slide-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditSlidePage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const slide = await prisma.slideshowImage.findUnique({
    where: { id },
    include: { media: { select: { url: true, altText: true } } },
  });
  if (!slide) {
    notFound();
  }

  return (
    <SlideForm slide={slide} error={query.error} saved={query.saved === "1"} />
  );
}
