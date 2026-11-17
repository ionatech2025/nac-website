"use server";

import { formDataToRecord } from "./submit-inquiry";
import { type SubmitComplaintResult, submitComplaint } from "./submit-complaint";

export type ComplaintFormState = SubmitComplaintResult | null;

/** Server action for the public anonymous complaint form; use with `useActionState`. */
export async function submitComplaintAction(
  _prev: ComplaintFormState,
  formData: FormData,
): Promise<ComplaintFormState> {
  return submitComplaint(formDataToRecord(formData));
}
