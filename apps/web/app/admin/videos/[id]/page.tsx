import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { VideoForm } from "../video-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditVideoPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const video = await prisma.videoLink.findUnique({
    where: { id },
    include: {
      thumbnailMedia: { select: { url: true, altText: true } },
    },
  });
  if (!video) {
    notFound();
  }

  return (
    <VideoForm video={video} error={query.error} saved={query.saved === "1"} />
  );
}
