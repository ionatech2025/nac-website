import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";
import { publicPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Downloads",
  description:
    "Strategies, reports and other documents from Network for Active Citizens.",
  path: "/downloads",
});

export default function DownloadsPage() {
  return (
    <PagePlaceholder
      title="Downloads"
      description="Placeholder for Epic E1 navigation. Downloads library is Epic E11."
    />
  );
}
