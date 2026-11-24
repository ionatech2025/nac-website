/**
 * Privacy notice seed/fallback (E15-07).
 * Mirrors PageContent key `privacy` for a later getPageContent swap.
 */

export const PRIVACY_PAGE_KEY = "privacy";

export type PrivacyPageContent = {
  title: string;
  body: string;
};

const seed: PrivacyPageContent = {
  title: "Privacy notice",
  body: `## Visitor statistics

NAC collects simple first-party page-view statistics so we can understand which public pages are useful. This uses a lightweight beacon that records the page path and, when available, the referring site.

We do **not** use advertising cookies or third-party tracking pixels for these statistics. We do **not** store raw IP addresses with page views. Counts are aggregated for the admin dashboard.

## Contact inquiries

If you send a message through the contact form, we store the details you provide so staff can reply. A honeypot field helps reduce spam. Do not send sensitive personal data through that form if another channel is more appropriate.

## Anonymous complaints

The complaints channel is designed so you can report concerns without identifying yourself. We do not ask for your name or contact details on that form. Complaint pages and related APIs are excluded from search indexing and from visitor analytics where possible.

Abuse controls (such as short-lived rate limits) are not linked to stored complaint records as personal identifiers.

## Questions

For privacy questions about this website, use the Contact Us page or the email address listed in the site footer.`,
};

export async function getPrivacyPageContent(): Promise<PrivacyPageContent> {
  return seed;
}
