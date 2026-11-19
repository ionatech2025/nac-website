import { requireAdmin } from "../../../../lib/require-admin";
import { SlideForm } from "../slide-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewSlidePage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <SlideForm error={params.error} />;
}
