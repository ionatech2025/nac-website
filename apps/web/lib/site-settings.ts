/**
 * Public site settings for layout (footer, contact, social, E14).
 * Seed mirrors `getPublicSiteSettings()` shape; empty string = hide that field.
 */

export type SiteDownload = {
  title: string;
  href: string;
  byteSize?: number;
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

const seedSocial: SocialProfiles = {
  facebook: "https://facebook.com/networkforactivecitizens",
  x: "https://twitter.com/activecitizensu",
  instagram: "",
  youtube: "",
  linkedin: "https://linkedin.com/company/network-for-active-citizens",
  tiktok: "",
};

const seedExternal: ExternalServices = {
  youthGoBudget: "https://youthgobudgetapp.org",
  slogbaa: "https://slogbaa.org",
};

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
  address:
    "Shaniela Courts, Plot 106, Nsubuga Road, Off Kisaasi-Kyanja Road, Kampala, Uganda",
  postal: "P.O. Box 801199 Ntinda, Uganda",
  phones: ["+256 (0) 393 216240", "+256 774 843 081", "+256 701 840 078"],
  tollFree: "+256 (0) 800 111 423",
  email: "activecitizenuganda@gmail.com",
  whatsapp: "256774843081",
  copyright: `© ${new Date().getFullYear()} Network for Active Citizens (NAC)`,
  socialProfiles: seedSocial,
  externalServices: seedExternal,
  social: linksFromSocial(seedSocial),
  external: linksFromExternal(seedExternal),
  latestDownloads: [
    {
      title: "NAC Strategic Plan 2024–2028",
      href: "https://nacuganda.org/sites/default/files/Downloads/NAC_Strategic%20Plan.pdf",
      byteSize: 2_400_000,
    },
  ],
};

/** Seed/fallback until public pages call `getPublicSiteSettings()` live. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return defaultSiteSettings;
}
