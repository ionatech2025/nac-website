import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { OrganisationForm } from "../org-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditMemberOrganisationPage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const organisation = await prisma.memberOrganisation.findUnique({
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
  });
  if (!organisation) notFound();

  return (
    <OrganisationForm
      organisation={organisation}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
