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
      lead="Key documents visitors can open quickly from the homepage."
    >
      <LatestDownloads downloads={downloads} heading="Available now" />
    </SectionShell>
  );
}
