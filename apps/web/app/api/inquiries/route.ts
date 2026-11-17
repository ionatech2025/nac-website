import { apiError, apiFailure, apiOk, readBody } from "../../../lib/api-response";
import { submitInquiry } from "../../../lib/submit-inquiry";

/**
 * Public contact-form endpoint (AD-B4-01).
 * Accepts JSON or form data: { name, email, subject, message, website? }.
 */
export async function POST(request: Request) {
  const raw = await readBody(request);
  if (!raw) return apiError("invalid");

  const result = await submitInquiry(raw);
  return result.ok ? apiOk({}, 201) : apiFailure(result);
}
