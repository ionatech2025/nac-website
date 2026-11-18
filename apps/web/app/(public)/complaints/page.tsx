import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Complaints" };

export default function ComplaintsPage() {
  return (
    <PagePlaceholder
      title="Complaints"
      description="Placeholder for Epic E1 navigation. Anonymous complaints form is Epic E13."
    />
  );
}