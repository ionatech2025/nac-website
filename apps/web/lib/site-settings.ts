/**
 * Public site settings for layout (footer, contact, social).
 * Defaults match nacuganda.org until Dev B wires SiteSetting queries.
 */

export type SiteDownload = {
  title: string;
  href: string;
  byteSize?: number;
};

export type SiteSettings = {
  orgName: string;
  tagline: string;
  address: string;
  postal: string;
  phones: string[];
  tollFree: string;
  email: string;
  copyright: string;
  social: { label: string; href: string }[];
  external: { label: string; href: string }[];
  latestDownloads: SiteDownload[];
};

export const defaultSiteSettings: SiteSettings = {
  orgName: "Network for Active Citizens",
  tagline: "Locally Engaged, Globally Connected",
  address:
    "Shaniela Courts, Plot 106, Nsubuga Road, Off Kisaasi-Kyanja Road, Kampala, Uganda",
  postal: "P.O. Box 801199 Ntinda, Uganda",
  phones: ["+256 (0) 393 216240", "+256 774 843 081", "+256 701 840 078"],
  tollFree: "+256 (0) 800 111 423",
  email: "activecitizenuganda@gmail.com",
  copyright: `© ${new Date().getFullYear()} Network for Active Citizens (NAC)`,
  social: [
    {
      label: "Facebook",
      href: "https://facebook.com/networkforactivecitizens",
    },
    {
      label: "X (Twitter)",
      href: "https://twitter.com/activecitizensu",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/network-for-active-citizens",
    },
  ],
  external: [
    { label: "Youth Go Budget", href: "https://youthgobudgetapp.org" },
    { label: "SLOGBAA", href: "https://slogbaa.org" },
  ],
  latestDownloads: [
    {
      title: "NAC Strategic Plan 2024–2028",
      href: "https://nacuganda.org/sites/default/files/Downloads/NAC_Strategic%20Plan.pdf",
      byteSize: 2_400_000,
    },
  ],
};

/** Swap to Prisma SiteSetting reads when data-access is ready. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return defaultSiteSettings;
}
