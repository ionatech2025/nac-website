import { requireAdmin } from "../../../../lib/require-admin";
import { TeamForm } from "../team-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewTeamMemberPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <TeamForm error={params.error} />;
}
