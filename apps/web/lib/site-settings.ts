/**
 * Public site settings for layout (footer, contact, social, E14).
 * Empty string = hide that field.
 */

import {
  getPublicSiteSettings,
  listPublishedDocuments,
} from "@repo/database";

export type SiteDownload = {
  title: string;
  href: string;
  byteSize?: number;
  fileType?: string;
};

export type SocialProfiles = {
  facebook: string;
  x: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
};

export type ExternalServices = {
  youthGoBudget: string;
  slogbaa: string;
};

export type SiteSettings = {
  orgName: string;
  tagline: string;
  address: string;
  postal: string;
  phones: string[];
  tollFree: string;
  email: string;
  /** Digits (256…) or https://wa.me/… — empty hides WhatsApp buttons. */
  whatsapp: string;
  copyright: string;
  socialProfiles: SocialProfiles;
  externalServices: ExternalServices;
  /** Non-empty social profile links for footer rendering. */
  social: { label: string; href: string }[];
  /** Non-empty partner tool links for footer / programmes. */
  external: { label: string; href: string }[];
  latestDownloads: SiteDownload[];
};

const SOCIAL_LABELS: { key: keyof SocialProfiles; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "x", label: "X (Twitter)" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
];

const EXTERNAL_LABELS: { key: keyof ExternalServices; label: string }[] = [
  { key: "youthGoBudget", label: "Youth Go Budget" },
  { key: "slogbaa", label: "SLOGBAA" },
];

export function linksFromSocial(
  social: SocialProfiles,
): { label: string; href: string }[] {
  return SOCIAL_LABELS.flatMap(({ key, label }) => {
    const href = social[key].trim();
    return href ? [{ label, href }] : [];
  });
}

export function linksFromExternal(
  external: ExternalServices,
): { label: string; href: string }[] {
  return EXTERNAL_LABELS.flatMap(({ key, label }) => {
    const href = external[key].trim();
    return href ? [{ label, href }] : [];
  });
}

/** Normalize WhatsApp digits or wa.me URL for contact buttons (E14-04). */
export function whatsappHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export const defaultSiteSettings: SiteSettings = {
  orgName: "Network for Active Citizens",
  tagline: "Locally Engaged, Globally Connected",
  address: "",
  postal: "",
  phones: [],
  tollFree: "",
  email: "",
  whatsapp: "",
  copyright: `© ${new Date().getFullYear()} Network for Active Citizens (NAC)`,
  socialProfiles: {
    facebook: "",
    x: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    tiktok: "",
  },
  externalServices: {
    youthGoBudget: "https://youthgobudgetapp.org",
    slogbaa: "https://slogbaa.org",
  },
  social: [],
  external: [
    { label: "Youth Go Budget", href: "https://youthgobudgetapp.org" },
    { label: "SLOGBAA", href: "https://slogbaa.org" },
  ],
  latestDownloads: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const [settings, documents] = await Promise.all([
    getPublicSiteSettings(),
    listPublishedDocuments(4),
  ]);

  const phones = [settings.contact.phone, settings.contact.phoneAlt]
    .map((value) => value.trim())
    .filter(Boolean);

  const socialProfiles: SocialProfiles = { ...settings.social };
  const externalServices: ExternalServices = { ...settings.external };

  return {
    orgName: defaultSiteSettings.orgName,
    tagline: defaultSiteSettings.tagline,
    address: settings.contact.physicalAddress.trim(),
    postal: settings.contact.postalAddress.trim(),
    phones,
    tollFree: settings.contact.tollFree.trim(),
    email: settings.contact.email.trim(),
    whatsapp: settings.contact.whatsapp.trim(),
    copyright: defaultSiteSettings.copyright,
    socialProfiles,
    externalServices,
    social: linksFromSocial(socialProfiles),
    external: linksFromExternal(externalServices),
    latestDownloads: documents.map((doc) => ({
      title: doc.title,
      href: doc.downloadPath,
      byteSize: doc.byteSize,
      fileType: doc.fileType,
    })),
  };
}
