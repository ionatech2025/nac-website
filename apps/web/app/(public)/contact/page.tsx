import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";
import { publicPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Contact Us",
  description:
    "Visit, call, or write to Network for Active Citizens in Kampala, Uganda.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PagePlaceholder
      title="Contact & inquiries"
      description="Placeholder for Epic E1 navigation. Contact form is Epic E12."
    />
  );
}
