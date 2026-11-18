import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { TeamForm } from "../team-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditTeamMemberPage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const member = await prisma.teamMember.findUnique({
    where: { id },
    include: { photo: { select: { url: true, altText: true } } },
  });
  if (!member) {
    notFound();
  }

  return (
    <TeamForm
      member={member}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
