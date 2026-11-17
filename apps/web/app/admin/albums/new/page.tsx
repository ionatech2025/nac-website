import { requireAdmin } from "../../../../lib/require-admin";
import { AlbumForm } from "../album-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewAlbumPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <AlbumForm error={params.error} />;
}
