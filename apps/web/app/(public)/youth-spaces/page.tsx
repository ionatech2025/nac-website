import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Youth Spaces" };

export default function YouthSpacesPage() {
  return (
    <PagePlaceholder
      title="Youth Spaces"
      description="Placeholder for Epic E1 navigation. Youth Spaces is Epic E6."
    />
  );
}
