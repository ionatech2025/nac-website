import { apiError, apiFailure, apiOk, readBody } from "../../../lib/api-response";
import { submitComplaint } from "../../../lib/submit-complaint";

const PRIVATE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};

/**
 * Public anonymous complaint endpoint (AD-B5-04).
 * Accepts JSON or form data: { description, category?, incidentDate?, programmeOrPlace?, website? }.
 * Only returns { ok } / error codes — never complaint data.
 */
export async function POST(request: Request) {
  const raw = await readBody(request);
  if (!raw) return apiError("invalid", {}, PRIVATE_HEADERS);

  const result = await submitComplaint(raw);
  return result.ok ? apiOk({}, 201, PRIVATE_HEADERS) : apiFailure(result, PRIVATE_HEADERS);
}
