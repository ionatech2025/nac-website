"use client";

import { useActionState, useMemo, useState, type FormEvent } from "react";
import {
  submitComplaintAction,
  type ComplaintFormState,
} from "@/lib/complaint-action";
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_HONEYPOT_FIELD,
  COMPLAINT_LIMITS,
  complaintFieldErrors,
  complaintSchema,
  type ComplaintFieldErrors,
} from "@/lib/complaint-schema";
import { complaintTodayYmd } from "@/lib/complaint-today";
import styles from "./complaint-form.module.css";

const initial: ComplaintFormState = null;

type Props = {
  todayYmd: string;
};

export function ComplaintForm({ todayYmd }: Props) {
  const [state, action, pending] = useActionState(submitComplaintAction, initial);
  const [clientErrors, setClientErrors] = useState<ComplaintFieldErrors>({});

  const fieldErrors = useMemo(() => {
    if (state && !state.ok && state.error === "validation") {
      return state.fieldErrors;
    }
    return clientErrors;
  }, [state, clientErrors]);

  const banner = useMemo(() => {
    if (!state) return null;
    if (state.ok) return null;
    if (state.error === "rate-limited") {
      return `Too many submissions. Please try again in about ${state.retryAfterSeconds} seconds.`;
    }
    if (state.error === "unexpected-fields") {
      return "This form only accepts the listed fields. Remove any identity details and try again.";
    }
    if (state.error === "server") {
      return "Something went wrong sending your complaint. Please try again.";
    }
    return "Please correct the highlighted fields and try again.";
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = complaintSchema(todayYmd || complaintTodayYmd()).safeParse(raw);
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(complaintFieldErrors(parsed.error).fieldErrors);
      return;
    }
    setClientErrors({});
  }

  if (state?.ok) {
    return (
      <div className={styles.success} role="status">
        <h2 className={styles.heading}>Complaint submitted</h2>
        <p>
          Thank you. Your anonymous complaint was received. There is no email
          acknowledgement. Records are deleted automatically after 30 days.
        </p>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      action={action}
      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
    >
      <h2 className={styles.heading}>Submit a complaint</h2>
      <p className={styles.lead}>
        Description is required. Category, incident date, and programme/place are
        optional. Do not include your name or contact details.
      </p>

      {banner ? (
        <p className={styles.errorBanner} role="alert">
          {banner}
        </p>
      ) : null}

      <label className={styles.honeypot} htmlFor="complaint-website">
        Website
        <input
          id="complaint-website"
          name={COMPLAINT_HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <div className={styles.field}>
        <label htmlFor="complaint-description">Description</label>
        <textarea
          id="complaint-description"
          name="description"
          required
          rows={7}
          maxLength={COMPLAINT_LIMITS.description.max}
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={
            fieldErrors.description ? "complaint-description-error" : undefined
          }
        />
        {fieldErrors.description ? (
          <p id="complaint-description-error" className={styles.fieldError}>
            {fieldErrors.description}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="complaint-category">Category (optional)</label>
        <input
          id="complaint-category"
          name="category"
          list="complaint-category-options"
          maxLength={COMPLAINT_LIMITS.category.max}
          aria-invalid={Boolean(fieldErrors.category)}
        />
        <datalist id="complaint-category-options">
          {COMPLAINT_CATEGORIES.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
        {fieldErrors.category ? (
          <p className={styles.fieldError}>{fieldErrors.category}</p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="complaint-date">Incident date (optional)</label>
        <input
          id="complaint-date"
          name="incidentDate"
          type="date"
          max={todayYmd}
          aria-invalid={Boolean(fieldErrors.incidentDate)}
        />
        {fieldErrors.incidentDate ? (
          <p className={styles.fieldError}>{fieldErrors.incidentDate}</p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="complaint-place">Programme or place (optional)</label>
        <input
          id="complaint-place"
          name="programmeOrPlace"
          maxLength={COMPLAINT_LIMITS.programmeOrPlace.max}
          aria-invalid={Boolean(fieldErrors.programmeOrPlace)}
        />
        {fieldErrors.programmeOrPlace ? (
          <p className={styles.fieldError}>{fieldErrors.programmeOrPlace}</p>
        ) : null}
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Sending…" : "Submit anonymous complaint"}
      </button>
    </form>
  );
}
