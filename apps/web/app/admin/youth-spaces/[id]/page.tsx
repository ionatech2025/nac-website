import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { SpaceForm } from "../space-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditYouthSpacePage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  if (!UUID.test(id)) notFound();

  const [space, regions] = await Promise.all([
    prisma.youthSpace.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          select: {
            id: true,
            caption: true,
            media: { select: { id: true, url: true, thumbUrl: true, altText: true } },
          },
        },
      },
    }),
    prisma.youthRegion.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  if (!space) notFound();

  return (
    <SpaceForm space={space} regions={regions} error={query.error} saved={query.saved === "1"} />
  );
}
