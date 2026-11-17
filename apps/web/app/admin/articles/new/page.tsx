import { requireAdmin } from "../../../../lib/require-admin";
import { ArticleForm } from "../article-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewArticlePage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <ArticleForm error={params.error} />;
}
