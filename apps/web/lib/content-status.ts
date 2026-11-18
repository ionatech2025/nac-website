export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ContentStatusValue = (typeof CONTENT_STATUSES)[number];

export function labelContentStatus(status: string): string {
  switch (status) {
    case "DRAFT":
      return "Draft";
    case "PUBLISHED":
      return "Published";
    case "ARCHIVED":
      return "Archived";
    default:
      return status;
  }
}

export function isContentStatus(value: string): value is ContentStatusValue {
  return (CONTENT_STATUSES as readonly string[]).includes(value);
}
