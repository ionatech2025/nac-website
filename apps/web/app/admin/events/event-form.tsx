import type { Event } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import { RICH_TEXT_HINT } from "../../../lib/rich-text";
import {
  imageUploadErrorMessage,
  type ImageUploadError,
} from "../../../lib/save-image-upload";
import {
  DEFAULT_EVENT_TIMEZONE,
  toKampalaDateTimeLocal,
} from "../../../lib/kampala-datetime";
import { FileDrop } from "../_components/form/file-drop";
import {
  Field,
  FormFooter,
  FormSection,
  formClass,
} from "../_components/form/form-fields";
import { FormPage, StatusCard } from "../_components/form/form-page";
import layoutStyles from "../_components/form/form-layout.module.css";
import { PreviewPanel } from "../_components/preview-panel";
import { createEvent, updateEvent } from "./actions";
import { EventActionsBar } from "./event-actions-bar";

type EventWithImage = Event & {
  image: { url: string; altText: string | null } | null;
};

type Props = {
  event?: EventWithImage;
  error?: string;
  saved?: boolean;
};

function errorCopy(error?: string): string | null {
  if (!error) return null;
  if (error === "validation") return "Check the required fields and try again.";
  if (error === "dates") {
    return "Start and end must be valid Kampala times, and end cannot be before start.";
  }
  if (error.startsWith("image-")) {
    return imageUploadErrorMessage(
      error.replace("image-", "") as ImageUploadError,
    );
  }
  return "Something went wrong. Try again.";
}

export function EventForm({ event, error, saved }: Props) {
  const isEdit = Boolean(event);
  const action = isEdit ? updateEvent.bind(null, event!.id) : createEvent;
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);
  const timezone = event?.timezone || DEFAULT_EVENT_TIMEZONE;

  return (
    <FormPage
      backHref="/admin/events"
      backLabel="Events"
      title={isEdit ? "Edit event" : "New event"}
      description="Events shown on the public Events page."
      status={event?.status === "CANCELLED" ? "Cancelled" : event?.status}
      error={errorCopy(error)}
      saved={saved}
      aside={
        <>
          <StatusCard updatedAt={event?.updatedAt}>
            <p className={layoutStyles.note}>
              Times are in {timezone}
              {event ? "" : " (UTC+3)"}.
            </p>
            {event ? <EventActionsBar id={event.id} status={event.status} /> : null}
          </StatusCard>
          {event ? (
            <PreviewPanel
              title={event.title}
              lines={[
                { label: "Location", value: event.location ?? "" },
                { label: "Starts", value: toKampalaDateTimeLocal(event.startAt).replace("T", " ") },
                { label: "Image", value: event.image ? "Uploaded" : "None" },
              ]}
            />
          ) : null}
        </>
      }
    >
      <form action={action} className={formClass}>
        <FormSection title="Details" description="What the event is and how it appears.">
          <Field label="Title" full>
            <input
              name="title"
              required
              placeholder="e.g. Annual Partners Forum"
              defaultValue={event?.title ?? ""}
            />
          </Field>
          <Field label="Slug" optional full hint="Generated from the title if left empty.">
            <input
              name="slug"
              placeholder="annual-partners-forum"
              defaultValue={event?.slug ?? ""}
            />
          </Field>
          <Field label="Description" full hint={RICH_TEXT_HINT}>
            <textarea
              name="description"
              required
              placeholder="Agenda, audience and anything attendees should know"
              defaultValue={event?.description ?? ""}
            />
          </Field>
        </FormSection>

        <FormSection title="Schedule & venue" description={`Dates and times use ${timezone}.`}>
          <Field label="Starts (Kampala)">
            <input
              name="startAt"
              type="datetime-local"
              required
              defaultValue={event ? toKampalaDateTimeLocal(event.startAt) : ""}
            />
          </Field>
          <Field label="Ends (Kampala)">
            <input
              name="endAt"
              type="datetime-local"
              required
              defaultValue={event ? toKampalaDateTimeLocal(event.endAt) : ""}
            />
          </Field>
          <Field label="Location" optional full>
            <input
              name="location"
              placeholder="e.g. Kampala Serena Hotel or Online"
              defaultValue={event?.location ?? ""}
            />
          </Field>
        </FormSection>

        <FormSection title="Registration & contact" description="How people sign up or ask questions.">
          <Field label="Registration URL" optional>
            <input
              name="registrationUrl"
              type="url"
              placeholder="https://"
              defaultValue={event?.registrationUrl ?? ""}
            />
          </Field>
          <Field label="Contact" optional>
            <input
              name="contact"
              placeholder="Name, email or phone"
              defaultValue={event?.contact ?? ""}
            />
          </Field>
        </FormSection>

        <FormSection title="Image" single>
          <Field label="Event image" optional group>
            <FileDrop
              name="image"
              accept="image/jpeg,image/png,image/webp"
              currentUrl={event?.image?.url}
              hint={`JPEG, PNG or WebP · up to ${maxMb} MB`}
            />
          </Field>
        </FormSection>

        <FormFooter
          cancelHref="/admin/events"
          submitLabel={isEdit ? "Save changes" : "Create draft"}
        />
      </form>
    </FormPage>
  );
}
