import { requireAdmin } from "../../../../lib/require-admin";
import { ProgrammeForm } from "../programme-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewProgrammePage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <ProgrammeForm error={params.error} />;
}
