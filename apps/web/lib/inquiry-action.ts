"use server";

import {
  type SubmitInquiryResult,
  formDataToRecord,
  submitInquiry,
} from "./submit-inquiry";

export type InquiryFormState = SubmitInquiryResult | null;

/** Server action for the public contact form; use with `useActionState`. */
export async function submitInquiryAction(
  _prev: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  return submitInquiry(formDataToRecord(formData));
}
