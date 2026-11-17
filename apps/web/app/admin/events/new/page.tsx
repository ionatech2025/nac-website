import { requireAdmin } from "../../../../lib/require-admin";
import { EventForm } from "../event-form";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewEventPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  return <EventForm error={params.error} />;
}
