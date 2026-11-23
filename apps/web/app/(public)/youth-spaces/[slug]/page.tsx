import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceDetailView } from "@/components/youth-spaces/space-detail";
import { getYouthSpaceBySlug } from "@/lib/youth-spaces-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const space = await getYouthSpaceBySlug(slug);
  return {
    title: space?.name ?? "Youth space",
    description: space?.description ?? undefined,
  };
}

export default async function YouthSpaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const space = await getYouthSpaceBySlug(slug);
  if (!space) notFound();

  return <SpaceDetailView space={space} />;
}
