import type { Metadata } from "next";
import { DocumentFilters } from "@/components/downloads/document-filters";
import { DocumentList } from "@/components/downloads/document-list";
import { MediaTabs } from "@/components/galleries/media-tabs";
import {
  listDocumentCategories,
  listDocumentsPage,
} from "@/lib/downloads-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import styles from "./downloads.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Documents",
  description:
    "Download NAC strategic plans, reports, guides and forms. File size and type are shown for each document.",
  path: "/downloads",
});

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
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Media Center</p>
          <h1 id="downloads-heading" className={styles.title}>
            Documents
          </h1>
          <p className={styles.lead}>
            Published documents from across the network. Filter by category to
            narrow the library.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <MediaTabs active="documents" />
        <DocumentFilters categories={categories} activeSlug={categorySlug} />
        <DocumentList
          documents={result.items}
          page={result.page}
          pageCount={result.pageCount}
          categorySlug={categorySlug}
        />
      </div>
    </section>
  );
}
