import { LatestDownloads } from "@/components/latest-downloads";
import type { HomeDownload } from "@/lib/home-data";
import { SectionShell } from "./section-shell";

type Props = {
  downloads: HomeDownload[];
};

export function HomeDownloads({ downloads }: Props) {
  return (
    <SectionShell
      id="downloads"
      eyebrow="Resources"
      title="Latest downloads"
      lead="Documents partners and visitors open most often."
      tone="tint"
    >
      <LatestDownloads downloads={downloads} heading="Available now" />
    </SectionShell>
  );
}
