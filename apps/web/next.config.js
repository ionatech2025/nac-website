import { SECURITY_HEADERS } from "./security-headers.js";

/** Privacy headers for anonymous complaint pages and API (E13-04). */
const COMPLAINT_HEADERS = [
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cache-Control", value: "no-store" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/database", "@repo/ui"],
  poweredByHeader: false,
  // bodySizeLimit stays under experimental even though Server Actions are stable (Next 16).
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb", // ≥ MAX_UPLOAD_BYTES (2.5 MB) + multipart overhead (ISSUE-003)
    },
  },
  async headers() {
    // Later rules win for the same header, so the stricter complaint
    // Referrer-Policy overrides the site-wide one.
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/:path(.*complaint.*)", headers: COMPLAINT_HEADERS },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
