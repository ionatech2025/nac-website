import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAboutProgrammeBySlug } from "@/lib/about-data";
import { RichText } from "@/lib/rich-text-view";
import styles from "./programme.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getAboutProgrammeBySlug(slug);
  return { title: programme?.title ?? "Programme" };
}

/** Minimal programme detail for About Us links (E3-04). Seed data only. */
export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme = await getAboutProgrammeBySlug(slug);
  if (!programme) notFound();

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/programs">Programmes</Link>
      </p>
      <h1 className={styles.title}>{programme.title}</h1>
      {programme.summary ? (
        <p className={styles.summary}>{programme.summary}</p>
      ) : null}
      <RichText text={programme.body} className={styles.body} />
    </article>
  );
}
