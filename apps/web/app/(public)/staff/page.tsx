import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Our Staff" };

export default function StaffPage() {
  return (
    <PagePlaceholder
      title="Our Staff"
      description="Placeholder for Epic E1 navigation. Staff directory is Epic E4."
    />
  );
}
