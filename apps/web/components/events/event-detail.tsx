import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { ShareLinks } from "@/components/share-links";
import { formatEventWhen, type PublicEvent } from "@/lib/events-data";
import { RichText } from "@/lib/rich-text-view";
import styles from "./event-detail.module.css";

type Props = {
  event: PublicEvent;
};

export function EventDetailView({ event }: Props) {
  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/events">Events</Link>
      </p>
      {event.cancelled ? (
        <p className={styles.cancelled}>Cancelled</p>
      ) : null}
      <h1 className={styles.title}>{event.title}</h1>
      <p className={styles.when}>
        <time dateTime={event.startAt}>{formatEventWhen(event)}</time>
      </p>
      {event.location ? (
        <p className={styles.location}>{event.location}</p>
      ) : null}

      {event.image ? (
        <div className={styles.hero}>
          <Image
            src={event.image.url}
            alt={event.image.altText}
            width={960}
            height={540}
            className={styles.heroImage}
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
      ) : null}

      <RichText text={event.description} className={styles.body} />

      {event.contact ? (
        <section className={styles.block} aria-labelledby="contact-heading">
          <h2 id="contact-heading" className={styles.heading}>
            Event contact
          </h2>
          <p className={styles.contact}>{event.contact}</p>
        </section>
      ) : null}

      {event.registrationUrl && !event.cancelled ? (
        <section className={styles.block} aria-labelledby="register-heading">
          <h2 id="register-heading" className={styles.heading}>
            Registration
          </h2>
          <p className={styles.registerCopy}>
            Register externally — there is no in-site registration form.
          </p>
          <ExternalLink href={event.registrationUrl} className={styles.register}>
            Register for this event
          </ExternalLink>
        </section>
      ) : null}

      {event.cancelled ? (
        <p className={styles.cancelledNote}>
          This event has been cancelled and is shown for information only.
        </p>
      ) : null}

      <ShareLinks path={`/events/${event.slug}`} title={event.title} />
    </article>
  );
}
