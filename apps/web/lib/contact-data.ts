/**
 * Contact settings (E12) — from `getPublicSiteSettings().contact`.
 */

import { getPublicSiteSettings } from "@repo/database";

export type ContactSettings = {
  physicalAddress: string;
  postalAddress: string;
  phone: string;
  phoneAlt: string;
  tollFree: string;
  email: string;
  whatsapp: string;
};

export async function getContactSettings(): Promise<ContactSettings> {
  const settings = await getPublicSiteSettings();
  return settings.contact;
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
