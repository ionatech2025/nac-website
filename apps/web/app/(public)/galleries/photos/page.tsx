import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";
import { publicPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Photo Gallery",
  description: "Photo albums from Network for Active Citizens.",
  path: "/galleries/photos",
});

export default function PhotoGalleryPage() {
  return (
    <PagePlaceholder
      title="Photo Gallery"
      description="Placeholder for Epic E1 navigation. Photo albums are Epic E10."
    />
  );
}
