import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return (
    <PagePlaceholder
      title="Opportunities"
      description="Placeholder for Epic E1 navigation. Opportunities is Epic E8."
    />
  );
}
