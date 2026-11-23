import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";
import { publicPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Galleries",
  description:
    "Photo albums and videos from Network for Active Citizens programmes and events.",
  path: "/galleries",
});

export default function GalleriesPage() {
  return (
    <PagePlaceholder
      title="Galleries"
      description="Photo and video gallery shells for navigation. Gallery content is Epic E10."
    />
  );
}
