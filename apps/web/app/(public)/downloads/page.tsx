import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Downloads" };

export default function DownloadsPage() {
  return (
    <PagePlaceholder
      title="Downloads"
      description="Placeholder for Epic E1 navigation. Downloads library is Epic E11."
    />
  );
}
