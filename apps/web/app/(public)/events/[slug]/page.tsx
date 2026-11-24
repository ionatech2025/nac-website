import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/events/event-detail";
import { getEventBySlug } from "@/lib/events-data";
import { publicPageMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };
  return publicPageMetadata({
    title: event.title,
    description: event.description,
    path: `/events/${event.slug}`,
    image: event.image
      ? { url: event.image.url, alt: event.image.altText }
      : null,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return <EventDetailView event={event} />;
}
