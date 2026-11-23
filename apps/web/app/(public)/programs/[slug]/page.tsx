import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAboutProgrammeBySlug } from "@/lib/about-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import { getProgrammeBySlug } from "@/lib/programmes-data";
import { RichText } from "@/lib/rich-text-view";
import styles from "./programme.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme =
    (await getProgrammeBySlug(slug)) ?? (await getAboutProgrammeBySlug(slug));
  if (!programme) return { title: "Programme" };
  return publicPageMetadata({
    title: programme.title,
    description: programme.summary,
    path: `/programs/${programme.slug}`,
  });
}

/** Programme detail (seed). Prefers E5 seed, falls back to About links. */
export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme =
    (await getProgrammeBySlug(slug)) ?? (await getAboutProgrammeBySlug(slug));
  if (!programme) notFound();

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/programs">Programs</Link>
      </p>
      <h1 className={styles.title}>{programme.title}</h1>
      {programme.summary ? (
        <p className={styles.summary}>{programme.summary}</p>
      ) : null}
      {programme.body ? (
        <RichText text={programme.body} className={styles.body} />
      ) : null}
    </article>
  );
}
