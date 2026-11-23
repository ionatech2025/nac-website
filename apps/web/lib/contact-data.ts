/**
 * Contact settings seed/fallback for Epic E12 (Dev A).
 * Matches `getPublicSiteSettings().contact` shape; swap to @repo/database later.
 */

export type ContactSettings = {
  physicalAddress: string;
  postalAddress: string;
  phone: string;
  phoneAlt: string;
  tollFree: string;
  email: string;
  whatsapp: string;
};

/** Seed mirrors current public site-settings defaults (empty = hide). */
const seedContact: ContactSettings = {
  physicalAddress:
    "Shaniela Courts, Plot 106, Nsubuga Road, Off Kisaasi-Kyanja Road, Kampala, Uganda",
  postalAddress: "P.O. Box 801199 Ntinda, Uganda",
  phone: "+256 (0) 393 216240",
  phoneAlt: "+256 774 843 081",
  tollFree: "+256 (0) 800 111 423",
  email: "activecitizenuganda@gmail.com",
  whatsapp: "256774843081",
};

export async function getContactSettings(): Promise<ContactSettings> {
  return seedContact;
}

export function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}
