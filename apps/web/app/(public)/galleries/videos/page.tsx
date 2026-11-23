import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";
import { publicPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Video Gallery",
  description: "Videos from Network for Active Citizens programmes and events.",
  path: "/galleries/videos",
});

export default function VideoGalleryPage() {
  return (
    <PagePlaceholder
      title="Video Gallery"
      description="Placeholder for Epic E1 navigation. Video gallery is Epic E10."
    />
  );
}
