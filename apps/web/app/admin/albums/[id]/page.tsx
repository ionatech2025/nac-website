import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { AlbumForm } from "../album-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditAlbumPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const album = await prisma.photoAlbum.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        include: { media: { select: { id: true, url: true, thumbUrl: true } } },
      },
    },
  });
  if (!album) {
    notFound();
  }

  return (
    <AlbumForm album={album} error={query.error} saved={query.saved === "1"} />
  );
}
