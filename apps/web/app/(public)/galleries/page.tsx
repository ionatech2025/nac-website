import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Galleries" };

export default function GalleriesPage() {
  return (
    <PagePlaceholder
      title="Galleries"
      description="Photo and video gallery shells for navigation. Gallery content is Epic E10."
    />
  );
}
