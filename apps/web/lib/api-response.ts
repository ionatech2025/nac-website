import { NextResponse } from "next/server";
import { formDataToRecord } from "./submit-inquiry";

/**
 * One response shape for every public JSON endpoint (B9-03):
 *   success → { ok: true, ...data }
 *   failure → { ok: false, error: <code>, message: <plain English>, ...details }
 * Clients branch on `error`; `message` is safe to show to visitors.
 */
export type ApiErrorCode =
  | "invalid"
  | "validation"
  | "unexpected-fields"
  | "rate-limited"
  | "server";

const STATUS: Record<ApiErrorCode, number> = {
  invalid: 400,
  "unexpected-fields": 400,
  validation: 422,
  "rate-limited": 429,
  server: 500,
};

const MESSAGES: Record<ApiErrorCode, string> = {
  invalid: "The request could not be read. Send JSON or form data.",
  "unexpected-fields": "The request contained fields that are not accepted.",
  validation: "Some fields need attention.",
  "rate-limited": "Too many submissions. Please wait and try again.",
  server: "Something went wrong on our side. Please try again later.",
};

type Headers = Record<string, string>;

export function apiOk(data: object = {}, status = 200, headers: Headers = {}) {
  return NextResponse.json({ ok: true, ...data }, { status, headers });
}

export function apiError(code: ApiErrorCode, details: object = {}, headers: Headers = {}) {
  const extra: Headers = { ...headers };
  const retry = (details as { retryAfterSeconds?: unknown }).retryAfterSeconds;
  if (typeof retry === "number") extra["Retry-After"] = String(retry);
  return NextResponse.json(
    { ok: false, error: code, message: MESSAGES[code], ...details },
    { status: STATUS[code], headers: extra },
  );
}

/** Maps a `{ ok: false, error, ...details }` result from a submit function. */
export function apiFailure(
  result: { ok: false; error: ApiErrorCode } & Record<string, unknown>,
  headers: Headers = {},
) {
  const { ok: _ok, error, ...details } = result;
  return apiError(error, details, headers);
}

/** Reads a JSON or form-data body as a plain object; null if unreadable. */
export async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const type = request.headers.get("content-type") ?? "";
    const raw: unknown = type.includes("application/json")
      ? await request.json()
      : formDataToRecord(await request.formData());
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    return raw as Record<string, unknown>;
  } catch {
    return null;
  }
}
