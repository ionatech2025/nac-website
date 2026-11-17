import { prisma } from "@repo/database";
import { getClientIp } from "./client-ip";
import { INQUIRY_RATE_LIMIT, consumeRateLimit } from "./form-rate-limit";
import {
  INQUIRY_HONEYPOT_FIELD,
  type InquiryFieldErrors,
  inquiryFieldErrors,
  inquirySchema,
} from "./inquiry-schema";

export type SubmitInquiryResult =
  | { ok: true }
  | { ok: false; error: "validation"; fieldErrors: InquiryFieldErrors }
  | { ok: false; error: "rate-limited"; retryAfterSeconds: number }
  | { ok: false; error: "server" };

/**
 * Validate, spam-check and store a contact-form inquiry.
 * Shared by the public API route and the server action.
 */
export async function submitInquiry(
  raw: Record<string, unknown>,
): Promise<SubmitInquiryResult> {
  const honeypot = raw[INQUIRY_HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: inquiryFieldErrors(parsed.error),
    };
  }

  const ip = await getClientIp();
  const limit = consumeRateLimit(`inquiry:${ip}`, INQUIRY_RATE_LIMIT);
  if (!limit.allowed) {
    return {
      ok: false,
      error: "rate-limited",
      retryAfterSeconds: limit.retryAfterSeconds,
    };
  }

  try {
    await prisma.inquiry.create({ data: parsed.data });
    return { ok: true };
  } catch (err) {
    console.error("[inquiry] store failed", (err as Error).message);
    return { ok: false, error: "server" };
  }
}

/** Plain string fields only; drops Next.js internal `$ACTION_*` keys. */
export function formDataToRecord(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION")) continue;
    if (typeof value === "string") out[key] = value;
  }
  return out;
}
