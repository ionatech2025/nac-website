import { createHash, randomBytes } from "node:crypto";
import { kampalaTodayYmd, prisma } from "@repo/database";
import { getClientIp } from "./client-ip";
import { consumeRateLimit, type RateLimitPolicy } from "./form-rate-limit";
import {
  COMPLAINT_HONEYPOT_FIELD,
  type ComplaintFieldErrors,
  complaintFieldErrors,
  complaintSchema,
} from "./complaint-schema";

export type SubmitComplaintResult =
  | { ok: true }
  | { ok: false; error: "validation"; fieldErrors: ComplaintFieldErrors }
  | { ok: false; error: "unexpected-fields" }
  | { ok: false; error: "rate-limited"; retryAfterSeconds: number }
  | { ok: false; error: "server" };

export const COMPLAINT_RATE_LIMIT: RateLimitPolicy = {
  max: 3,
  windowMs: 30 * 60 * 1000,
};

/** Random per process: the limiter key can't be reversed to an IP or reused later. */
const PROCESS_SALT = randomBytes(16).toString("hex");

function anonymousKey(ip: string): string {
  const digest = createHash("sha256").update(`${PROCESS_SALT}:${ip}`).digest("hex");
  return `complaint:${digest.slice(0, 32)}`;
}

/**
 * Validate and store an anonymous complaint (AD-B5-04, E13-04..07).
 * Never reads or stores IP, user agent, referrer, cookies or geo with the row,
 * and never logs complaint content.
 */
export async function submitComplaint(
  raw: Record<string, unknown>,
): Promise<SubmitComplaintResult> {
  const honeypot = raw[COMPLAINT_HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  const today = kampalaTodayYmd();
  const parsed = complaintSchema(today).safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors, unexpected } = complaintFieldErrors(parsed.error);
    return unexpected
      ? { ok: false, error: "unexpected-fields" }
      : { ok: false, error: "validation", fieldErrors };
  }

  const limit = consumeRateLimit(anonymousKey(await getClientIp()), COMPLAINT_RATE_LIMIT);
  if (!limit.allowed) {
    return { ok: false, error: "rate-limited", retryAfterSeconds: limit.retryAfterSeconds };
  }

  const { description, category, incidentDate, programmeOrPlace } = parsed.data;
  const submittedOn = new Date(`${today}T00:00:00.000Z`);
  try {
    await prisma.complaint.create({
      data: {
        description,
        category: category ?? null,
        incidentDate: incidentDate ? new Date(`${incidentDate}T00:00:00.000Z`) : null,
        programmeOrPlace: programmeOrPlace ?? null,
        submittedOn,
        createdAt: submittedOn,
      },
    });
    return { ok: true };
  } catch (err) {
    const code = (err as { code?: string }).code ?? "unknown";
    console.error(`[complaint] store failed (code ${code})`);
    return { ok: false, error: "server" };
  }
}
