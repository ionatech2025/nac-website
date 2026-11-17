import type { PrismaClient } from "@prisma/client";
import { prisma } from "./client";
import {
  DEFAULT_CONTACT,
  DEFAULT_EXTERNAL,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SOCIAL,
  parseContact,
  parseExternal,
  parseSocial,
  SITE_SETTING_KEYS,
  type PublicSiteSettings,
} from "./site-settings-keys";

type Db = PrismaClient | typeof prisma;

/**
 * Contact, social and external links for the public site (footer, contact
 * page, E14). Missing rows fall back to defaults so Dev A never gets null.
 */
export async function getPublicSiteSettings(
  db: Db = prisma,
): Promise<PublicSiteSettings> {
  const rows = await db.siteSetting.findMany({
    where: { key: { in: Object.values(SITE_SETTING_KEYS) } },
    select: { key: true, value: true },
  });
  const byKey = new Map(rows.map((row) => [row.key, row.value]));

  return {
    contact: byKey.has(SITE_SETTING_KEYS.contact)
      ? parseContact(byKey.get(SITE_SETTING_KEYS.contact))
      : { ...DEFAULT_CONTACT },
    social: byKey.has(SITE_SETTING_KEYS.social)
      ? parseSocial(byKey.get(SITE_SETTING_KEYS.social))
      : { ...DEFAULT_SOCIAL },
    external: byKey.has(SITE_SETTING_KEYS.external)
      ? parseExternal(byKey.get(SITE_SETTING_KEYS.external))
      : { ...DEFAULT_EXTERNAL },
  };
}

/**
 * Idempotent seed/bootstrap: create the three setting rows if missing.
 * Existing values are never overwritten (admin edits survive a re-seed).
 */
export async function ensureSiteSettings(db: Db = prisma): Promise<number> {
  let created = 0;
  const seeds: [string, object][] = [
    [SITE_SETTING_KEYS.contact, DEFAULT_CONTACT],
    [SITE_SETTING_KEYS.social, DEFAULT_SOCIAL],
    [SITE_SETTING_KEYS.external, DEFAULT_EXTERNAL],
  ];
  for (const [key, value] of seeds) {
    const existing = await db.siteSetting.findUnique({
      where: { key },
      select: { id: true },
    });
    if (existing) continue;
    await db.siteSetting.create({ data: { key, value } });
    created += 1;
  }
  return created;
}

export { DEFAULT_SITE_SETTINGS, SITE_SETTING_KEYS };
