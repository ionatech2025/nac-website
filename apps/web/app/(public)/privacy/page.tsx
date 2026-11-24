import type { Metadata } from "next";
import { getPrivacyPageContent } from "@/lib/privacy-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import { RichText } from "@/lib/rich-text-view";
import styles from "./privacy.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Privacy notice",
  description:
    "How Network for Active Citizens collects visitor statistics and handles anonymous complaints.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const page = await getPrivacyPageContent();

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 className={styles.title}>{page.title}</h1>
      <RichText text={page.body} className={styles.body} />
    </article>
  );
}
