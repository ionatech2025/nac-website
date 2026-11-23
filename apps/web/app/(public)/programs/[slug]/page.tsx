import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammeDetailView } from "@/components/programmes/programme-detail";
import { getProgrammeBySlug } from "@/lib/programmes-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  return {
    title: programme?.title ?? "Programme",
    description: programme?.summary ?? undefined,
  };
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  if (!programme) notFound();

  return <ProgrammeDetailView programme={programme} />;
}
