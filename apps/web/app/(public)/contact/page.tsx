import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <PagePlaceholder
      title="Contact & inquiries"
      description="Placeholder for Epic E1 navigation. Contact form is Epic E12."
    />
  );
}
