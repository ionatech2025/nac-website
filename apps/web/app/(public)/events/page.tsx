import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <PagePlaceholder
      title="Events"
      description="Placeholder for Epic E1 navigation. Events calendar is Epic E9."
    />
  );
}
