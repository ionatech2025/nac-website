"use client";

import { useActionState, useMemo, useState, type FormEvent } from "react";
import {
  submitInquiryAction,
  type InquiryFormState,
} from "@/lib/inquiry-action";
import {
  INQUIRY_HONEYPOT_FIELD,
  INQUIRY_LIMITS,
  inquiryFieldErrors,
  inquirySchema,
  type InquiryFieldErrors,
} from "@/lib/inquiry-schema";
import styles from "./inquiry-form.module.css";

const initial: InquiryFormState = null;

export function InquiryForm() {
  const [state, action, pending] = useActionState(submitInquiryAction, initial);
  const [clientErrors, setClientErrors] = useState<InquiryFieldErrors>({});

  const fieldErrors = useMemo(() => {
    if (state && !state.ok && state.error === "validation") {
      return state.fieldErrors;
    }
    return clientErrors;
  }, [state, clientErrors]);

  const banner = useMemo(() => {
    if (!state) return null;
    if (state.ok) {
      return {
        tone: "success" as const,
        message:
          "Thank you — your inquiry was sent. We will get back to you soon.",
      };
    }
    if (state.error === "rate-limited") {
      return {
        tone: "error" as const,
        message: `Too many submissions. Please try again in about ${state.retryAfterSeconds} seconds.`,
      };
    }
    if (state.error === "server") {
      return {
        tone: "error" as const,
        message: "Something went wrong sending your inquiry. Please try again.",
      };
    }
    return {
      tone: "error" as const,
      message: "Please correct the highlighted fields and try again.",
    };
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = inquirySchema.safeParse(data);
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(inquiryFieldErrors(parsed.error));
      return;
    }
    setClientErrors({});
  }

  if (state?.ok) {
    return (
      <div className={styles.success} role="status">
        <h2 className={styles.heading}>Inquiry sent</h2>
        <p>{banner?.message}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} action={action} onSubmit={onSubmit} noValidate>
      <h2 className={styles.heading}>Send an inquiry</h2>
      <p className={styles.lead}>
        Name, email, subject and message. We will reply by email.
      </p>

      {banner ? (
        <p
          className={banner.tone === "error" ? styles.errorBanner : styles.successBanner}
          role="alert"
        >
          {banner.message}
        </p>
      ) : null}

      <label className={styles.honeypot} htmlFor="inquiry-website">
        Website
        <input
          id="inquiry-website"
          name={INQUIRY_HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <Field
        id="inquiry-name"
        name="name"
        label="Name"
        required
        maxLength={INQUIRY_LIMITS.name.max}
        error={fieldErrors.name}
      />
      <Field
        id="inquiry-email"
        name="email"
        label="Email"
        type="email"
        required
        maxLength={INQUIRY_LIMITS.email.max}
        error={fieldErrors.email}
        autoComplete="email"
      />
      <Field
        id="inquiry-subject"
        name="subject"
        label="Subject"
        required
        maxLength={INQUIRY_LIMITS.subject.max}
        error={fieldErrors.subject}
      />
      <div className={styles.field}>
        <label htmlFor="inquiry-message">Message</label>
        <textarea
          id="inquiry-message"
          name="message"
          required
          rows={6}
          maxLength={INQUIRY_LIMITS.message.max}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "inquiry-message-error" : undefined}
        />
        {fieldErrors.message ? (
          <p id="inquiry-message-error" className={styles.fieldError}>
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  error,
  type = "text",
  required,
  maxLength,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className={styles.fieldError}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
