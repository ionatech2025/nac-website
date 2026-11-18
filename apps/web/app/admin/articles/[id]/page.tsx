import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { ArticleForm } from "../article-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditArticlePage({
  params,
  searchParams,
}: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      coverImage: { select: { url: true, altText: true } },
      ogImage: { select: { url: true, altText: true } },
    },
  });
  if (!article) {
    notFound();
  }

  return (
    <ArticleForm
      article={article}
      error={query.error}
      saved={query.saved === "1"}
    />
  );
}
