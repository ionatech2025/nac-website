/** Africa/Kampala calendar date as YYYY-MM-DD for complaint form validation. */
export function complaintTodayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
