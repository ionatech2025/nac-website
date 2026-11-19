import { requireAdmin } from "../../../../lib/require-admin";
import { VideoForm } from "../video-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewVideoPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <VideoForm error={params.error} />;
}
