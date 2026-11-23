import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpportunityDetailView } from "@/components/opportunities/opportunity-detail";
import { getOpportunityBySlug } from "@/lib/opportunities-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);
  return {
    title: opportunity?.title ?? "Opportunity",
    description: opportunity?.description ?? undefined,
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();

  return <OpportunityDetailView opportunity={opportunity} />;
}
