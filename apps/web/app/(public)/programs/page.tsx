import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Programs" };

export default function ProgramsPage() {
  return (
    <PagePlaceholder
      title="Programs"
      description="Placeholder for Epic E1 navigation. Programme listing and detail are Epic E5."
    />
  );
}
