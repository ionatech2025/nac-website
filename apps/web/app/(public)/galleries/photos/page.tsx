import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Photo Gallery" };

export default function PhotoGalleryPage() {
  return (
    <PagePlaceholder
      title="Photo Gallery"
      description="Placeholder for Epic E1 navigation. Photo albums are Epic E10."
    />
  );
}
