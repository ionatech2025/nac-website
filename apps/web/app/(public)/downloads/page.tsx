import type { Metadata } from "next";
import { DocumentFilters } from "@/components/downloads/document-filters";
import { DocumentList } from "@/components/downloads/document-list";
import {
  listDocumentCategories,
  listDocumentsPage,
} from "@/lib/downloads-data";
import styles from "./downloads.module.css";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Download NAC strategic plans, reports, guides and forms. File size and type are shown for each document.",
};

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export default async function DownloadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category?.trim() ?? "";
  const [categories, result] = await Promise.all([
    listDocumentCategories(),
    listDocumentsPage({
      page: Number(params.page) || 1,
      categorySlug: categorySlug || undefined,
    }),
  ]);

  return (
    <section className={styles.page} aria-labelledby="downloads-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="downloads-heading" className={styles.title}>
        Downloads
      </h1>
      <p className={styles.lead}>
        Published documents from across the network. Filter by category to narrow
        the library.
      </p>
      <p className={styles.note}>
        Files are typically PDF and kept within the 2.5 MB upload limit used
        elsewhere on the site.
      </p>
      <DocumentFilters categories={categories} activeSlug={categorySlug} />
      <DocumentList
        documents={result.items}
        page={result.page}
        pageCount={result.pageCount}
        categorySlug={categorySlug}
      />
    </section>
  );
}
