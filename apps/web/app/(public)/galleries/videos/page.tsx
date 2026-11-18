import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Video Gallery" };

export default function VideoGalleryPage() {
  return (
    <PagePlaceholder
      title="Video Gallery"
      description="Placeholder for Epic E1 navigation. Video gallery is Epic E10."
    />
  );
}
