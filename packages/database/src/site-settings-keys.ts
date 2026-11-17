/**
 * Site settings shape for contact, social and external links (AD-B6-01).
 * Stored as three `SiteSetting` rows (`contact` / `social` / `external`) with
 * JSON values so the admin form and public footer share one typed contract.
 */

export const SITE_SETTING_KEYS = {
  contact: "contact",
  social: "social",
  external: "external",
} as const;

export type SiteSettingKey =
  (typeof SITE_SETTING_KEYS)[keyof typeof SITE_SETTING_KEYS];

export type ContactSettings = {
  physicalAddress: string;
  postalAddress: string;
  /** Primary phone — render as tel: when non-empty. */
  phone: string;
  /** Optional second number. */
  phoneAlt: string;
  tollFree: string;
  email: string;
  /**
   * WhatsApp contact for E14-04 buttons: international digits (e.g. 2567…)
   * or a full https://wa.me/… URL. Empty = hide the button.
   */
  whatsapp: string;
};

export type SocialSettings = {
  facebook: string;
  x: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
};

export type ExternalSettings = {
  youthGoBudget: string;
  slogbaa: string;
};

export type PublicSiteSettings = {
  contact: ContactSettings;
  social: SocialSettings;
  external: ExternalSettings;
};

export const DEFAULT_CONTACT: ContactSettings = {
  physicalAddress: "",
  postalAddress: "",
  phone: "",
  phoneAlt: "",
  tollFree: "",
  email: "",
  whatsapp: "",
};

export const DEFAULT_SOCIAL: SocialSettings = {
  facebook: "",
  x: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  tiktok: "",
};

export const DEFAULT_EXTERNAL: ExternalSettings = {
  youthGoBudget: "https://youthgobudgetapp.org",
  slogbaa: "https://slogbaa.org",
};

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  contact: DEFAULT_CONTACT,
  social: DEFAULT_SOCIAL,
  external: DEFAULT_EXTERNAL,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(record: Record<string, unknown>, key: string, fallback = ""): string {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

export function parseContact(value: unknown): ContactSettings {
  const r = asRecord(value);
  return {
    physicalAddress: str(r, "physicalAddress"),
    postalAddress: str(r, "postalAddress"),
    phone: str(r, "phone"),
    phoneAlt: str(r, "phoneAlt"),
    tollFree: str(r, "tollFree"),
    email: str(r, "email"),
    whatsapp: str(r, "whatsapp"),
  };
}

export function parseSocial(value: unknown): SocialSettings {
  const r = asRecord(value);
  return {
    facebook: str(r, "facebook"),
    x: str(r, "x") || str(r, "twitter"),
    instagram: str(r, "instagram"),
    youtube: str(r, "youtube"),
    linkedin: str(r, "linkedin"),
    tiktok: str(r, "tiktok"),
  };
}

export function parseExternal(value: unknown): ExternalSettings {
  const r = asRecord(value);
  return {
    youthGoBudget: str(r, "youthGoBudget", DEFAULT_EXTERNAL.youthGoBudget),
    slogbaa: str(r, "slogbaa", DEFAULT_EXTERNAL.slogbaa),
  };
}
