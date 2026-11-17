import { z } from "zod";

/**
 * Anonymous complaint schema (E13-02 / AD-B5-04).
 * Strict: any key outside the allow-list (e.g. name, email, phone) is rejected.
 * Safe to import from client components for feedback; the server re-validates.
 */
export const COMPLAINT_LIMITS = {
  description: { min: 10, max: 5000 },
  category: { max: 120 },
  programmeOrPlace: { max: 200 },
} as const;

/** Suggested options for the public form; free text is also accepted. */
export const COMPLAINT_CATEGORIES = [
  "Programme delivery",
  "Staff or volunteer conduct",
  "Safeguarding",
  "Misuse of funds or resources",
  "Discrimination or exclusion",
  "Other",
] as const;

export const COMPLAINT_HONEYPOT_FIELD = "website";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters.`)
    .optional()
    .transform((v) => (v ? v : undefined));

export function complaintSchema(todayYmd: string) {
  return z.strictObject({
    description: z
      .string({ error: "Please describe your complaint." })
      .trim()
      .min(
        COMPLAINT_LIMITS.description.min,
        `Please write at least ${COMPLAINT_LIMITS.description.min} characters.`,
      )
      .max(
        COMPLAINT_LIMITS.description.max,
        `Please keep it under ${COMPLAINT_LIMITS.description.max} characters.`,
      ),
    category: optionalText(COMPLAINT_LIMITS.category.max, "Category"),
    incidentDate: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined))
      .refine((v) => v === undefined || DATE_RE.test(v), "Use a valid date.")
      .refine(
        (v) => v === undefined || (v >= "2000-01-01" && v <= todayYmd),
        "The incident date can't be in the future.",
      ),
    programmeOrPlace: optionalText(
      COMPLAINT_LIMITS.programmeOrPlace.max,
      "Programme or place",
    ),
    [COMPLAINT_HONEYPOT_FIELD]: z.string().optional(),
  });
}

export type ComplaintField =
  | "description"
  | "category"
  | "incidentDate"
  | "programmeOrPlace";
export type ComplaintFieldErrors = Partial<Record<ComplaintField, string>>;

export function complaintFieldErrors(error: z.ZodError): {
  fieldErrors: ComplaintFieldErrors;
  unexpected: boolean;
} {
  const fieldErrors: ComplaintFieldErrors = {};
  let unexpected = false;
  for (const issue of error.issues) {
    if (issue.code === "unrecognized_keys") {
      unexpected = true;
      continue;
    }
    const field = issue.path[0] as ComplaintField | undefined;
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return { fieldErrors, unexpected };
}
