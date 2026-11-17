import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";

const MB = MAX_UPLOAD_BYTES / (1024 * 1024);

export const SUPPORT_CONTACTS = [
  { label: "iONA support", email: "support@ionatec.com" },
  { label: "iONA technical lead", email: "2060iona.shemuel@gmail.com" },
];

export type HelpTopic = { id: string; title: string; points: string[]; href?: string };

/** Content-entry guidance (AD-B9-05). Kept as data so the page stays small. */
export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "publishing",
    title: "Drafts, publishing and archiving",
    points: [
      "Everything you create starts as a Draft. Drafts are never shown on the public site.",
      "Use Publish in the right-hand panel to make it live, Unpublish to take it down again, and Archive to retire it without deleting.",
      "Saving changes to a published item updates the live page straight away.",
    ],
  },
  {
    id: "writing",
    title: "Writing long text",
    points: [
      "Leave a blank line between paragraphs.",
      "Start a line with “- ” to make a bullet list, or “## ” for a heading.",
      "Wrap words in **double asterisks** to make them bold. Paste a full web address (https://…) and it becomes a link.",
      "HTML and pasted formatting are removed when you save — this keeps the site safe.",
    ],
  },
  {
    id: "images",
    title: "Images and PDFs",
    points: [
      `Images: JPEG, PNG or WebP, up to ${MB} MB each. Smaller versions for cards and galleries are made automatically.`,
      `PDFs: up to ${MB} MB. Compress large reports before uploading.`,
      "Always fill in alt text on photos — describe what the photo shows for visitors using screen readers.",
      "Replacing a download keeps its public link working, so links you already shared don't break.",
    ],
  },
  {
    id: "articles",
    title: "Articles, events and opportunities",
    href: "/admin/articles",
    points: [
      "Articles need a cover image. The excerpt is the short text on news cards; SEO fields are optional.",
      "Event times are Kampala time. Events move to “Past” automatically when they end.",
      "Opportunities show as Open or Closed automatically from the opening and closing dates — no need to close them by hand.",
    ],
  },
  {
    id: "organisation",
    title: "Team, programmes and youth spaces",
    href: "/admin/youth-spaces",
    points: [
      "Use Sort order to control the order on the public site — lower numbers appear first.",
      "Youth spaces belong to a region. Manage regions from the Regions button on the Youth spaces page.",
      "Each youth space can have up to 5 photos; the first photo is used on its card.",
    ],
  },
  {
    id: "inbox",
    title: "Inquiries and complaints",
    href: "/admin/inquiries",
    points: [
      "Contact-form messages arrive in Inquiries. Reply by email, then archive them.",
      "Complaints are anonymous: no name, email or exact time is stored, and they are deleted automatically after 30 days.",
      "Badges in the sidebar show unread inquiries and new complaints.",
    ],
  },
  {
    id: "account",
    title: "Signing in safely",
    points: [
      "Never share the admin password. Sign out when you finish on a shared computer.",
      "After 5 wrong passwords the login is locked for 15 minutes.",
      "If you forget the password, contact iONA support to reset it.",
    ],
  },
];
