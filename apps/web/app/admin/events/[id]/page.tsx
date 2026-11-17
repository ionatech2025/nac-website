import { notFound } from "next/navigation";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../../../lib/require-admin";
import { EventForm } from "../event-form";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditEventPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { image: { select: { url: true, altText: true } } },
  });
  if (!event) {
    notFound();
  }

  return (
    <EventForm event={event} error={query.error} saved={query.saved === "1"} />
  );
}
