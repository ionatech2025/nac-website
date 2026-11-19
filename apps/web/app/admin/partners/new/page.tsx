import { requireAdmin } from "../../../../lib/require-admin";
import { PartnerForm } from "../partner-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewPartnerPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <PartnerForm error={params.error} />;
}
