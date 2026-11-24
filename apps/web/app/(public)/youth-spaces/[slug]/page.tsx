import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpaceDetailView } from "@/components/youth-spaces/space-detail";
import { publicPageMetadata } from "@/lib/page-metadata";
import { getYouthSpaceBySlug } from "@/lib/youth-spaces-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const space = await getYouthSpaceBySlug(slug);
  if (!space) return { title: "Youth space" };
  return publicPageMetadata({
    title: space.name,
    description: space.description,
    path: `/youth-spaces/${space.slug}`,
    image: space.images[0]
      ? { url: space.images[0].url, alt: space.images[0].altText }
      : null,
  });
}

export default async function YouthSpaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const space = await getYouthSpaceBySlug(slug);
  if (!space) notFound();

  return <SpaceDetailView space={space} />;
}
