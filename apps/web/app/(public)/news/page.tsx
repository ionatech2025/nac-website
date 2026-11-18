import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Blogs & News" };

export default function NewsPage() {
  return (
    <PagePlaceholder
      title="Blogs & News"
      description="Placeholder for Epic E1 navigation. News is Epic E7."
    />
  );
}
