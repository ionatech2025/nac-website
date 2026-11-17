import { requireAdmin } from "../../../../lib/require-admin";
import { FeaturedForm } from "../featured-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewFeaturedPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <FeaturedForm error={params.error} />;
}
