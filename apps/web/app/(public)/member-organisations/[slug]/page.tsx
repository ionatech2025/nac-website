import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberOrgDetailView } from "@/components/member-organisations/member-org-detail";
import { getMemberOrganisationBySlug } from "@/lib/member-organisations-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const organisation = await getMemberOrganisationBySlug(slug);
  return {
    title: organisation?.name ?? "Member organisation",
    description: organisation?.bio
      ? organisation.bio.replace(/\s+/g, " ").trim().slice(0, 160)
      : undefined,
  };
}

export default async function MemberOrganisationDetailPage({ params }: Props) {
  const { slug } = await params;
  const organisation = await getMemberOrganisationBySlug(slug);
  if (!organisation) notFound();

  return <MemberOrgDetailView organisation={organisation} />;
}
