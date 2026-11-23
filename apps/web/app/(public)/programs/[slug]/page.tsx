import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammeDetailView } from "@/components/programmes/programme-detail";
import { getProgrammeBySlug } from "@/lib/programmes-data";
import { resolveProgrammeExternalLinks } from "@/lib/programmes-external";
import { getSiteSettings } from "@/lib/site-settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  return { title: programme?.title ?? "Programme" };
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const [programme, settings] = await Promise.all([
    getProgrammeBySlug(slug),
    getSiteSettings(),
  ]);
  if (!programme) notFound();

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
