import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";
import { publicPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Complaints",
  description: "Anonymous complaints channel for Network for Active Citizens.",
  path: "/complaints",
  noIndex: true,
});

export default function ComplaintsPage() {
  return (
    <PagePlaceholder
      title="Complaints"
      description="Placeholder for Epic E1 navigation. Anonymous complaints form is Epic E13."
    />
  );
}
