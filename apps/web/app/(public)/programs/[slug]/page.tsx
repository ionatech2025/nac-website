import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgrammeDetailView } from "@/components/programmes/programme-detail";
import { getAboutProgrammeBySlug } from "@/lib/about-data";
import { publicPageMetadata } from "@/lib/page-metadata";
import { getProgrammeBySlug } from "@/lib/programmes-data";
import { resolveProgrammeExternalLinks } from "@/lib/programmes-external";
import { RichText } from "@/lib/rich-text-view";
import { getSiteSettings } from "@/lib/site-settings";
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

/** Prefers full E5/E14 programme detail; falls back to About seed copy. */
export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const [programme, aboutProgramme, settings] = await Promise.all([
    getProgrammeBySlug(slug),
    getAboutProgrammeBySlug(slug),
    getSiteSettings(),
  ]);

  if (programme) {
    const externalLinks = resolveProgrammeExternalLinks(
      programme.externalLinkKeys,
      settings.externalServices,
    );
    return (
      <ProgrammeDetailView
        programme={programme}
        externalLinks={externalLinks}
      />
    );
  }

  if (!aboutProgramme) notFound();

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/programs">Programmes</Link>
      </p>
      <h1 className={styles.title}>{aboutProgramme.title}</h1>
      {aboutProgramme.summary ? (
        <p className={styles.summary}>{aboutProgramme.summary}</p>
      ) : null}
      {aboutProgramme.body ? (
        <RichText text={aboutProgramme.body} className={styles.body} />
      ) : null}
    </article>
  );
}
