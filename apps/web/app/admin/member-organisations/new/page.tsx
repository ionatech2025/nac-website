import { requireAdmin } from "../../../../lib/require-admin";
import { OrganisationForm } from "../org-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewMemberOrganisationPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <OrganisationForm error={params.error} />;
}
