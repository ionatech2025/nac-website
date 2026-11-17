/**
 * Site-wide security headers (AD-B9-03 / B9-06). Imported by next.config.js.
 *
 * The CSP allows 'unsafe-inline' scripts because Next.js injects inline
 * hydration scripts; moving to nonces would force every page to render
 * dynamically. Everything else is locked to our own origin plus the few
 * hosts we actually use (Vercel Blob for uploads, YouTube/Vimeo embeds,
 * Google Maps embeds).
 */
const isDev = process.env.NODE_ENV !== "production";

const BLOB = "https://*.public.blob.vercel-storage.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${BLOB} https://i.ytimg.com https://img.youtube.com https://i.vimeocdn.com`,
  "font-src 'self' data:",
  `media-src 'self' ${BLOB}`,
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://www.google.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

export const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // HSTS only in production: on localhost it would pin the browser to https.
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];
