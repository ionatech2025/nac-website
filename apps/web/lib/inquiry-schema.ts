import { z } from "zod";

/**
 * Shared contact-form schema (E12-03 / AD-B4-01).
 * Safe to import from client components for instant feedback; the server
 * always re-validates with the same schema.
 */
export const INQUIRY_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 254 },
  subject: { min: 3, max: 200 },
  message: { min: 10, max: 5000 },
} as const;

/** Hidden field; humans leave it empty, naive bots fill it. */
export const INQUIRY_HONEYPOT_FIELD = "website";

const text = (label: string, min: number, max: number) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be at most ${max} characters.`);

export const inquirySchema = z.object({
  name: text("Name", INQUIRY_LIMITS.name.min, INQUIRY_LIMITS.name.max),
  email: z
    .string({ error: "Email is required." })
    .trim()
    .toLowerCase()
    .max(INQUIRY_LIMITS.email.max, "Email is too long.")
    .pipe(z.email("Enter a valid email address.")),
  subject: text("Subject", INQUIRY_LIMITS.subject.min, INQUIRY_LIMITS.subject.max),
  message: text("Message", INQUIRY_LIMITS.message.min, INQUIRY_LIMITS.message.max),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryField = keyof InquiryInput;
export type InquiryFieldErrors = Partial<Record<InquiryField, string>>;

export function inquiryFieldErrors(error: z.ZodError): InquiryFieldErrors {
  const out: InquiryFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as InquiryField | undefined;
    if (field && !out[field]) out[field] = issue.message;
  }
  return out;
}
