/**
 * Permanent redirects from legacy nacuganda.org / Drupal paths (E15-03).
 * Expand further as content migration confirms additional moved URLs.
 */

/** @type {{ source: string; destination: string; permanent: boolean }[]} */
export const LEGACY_REDIRECTS = [
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/about-us/:path*", destination: "/about", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },
  { source: "/blogs-news", destination: "/news", permanent: true },
  { source: "/blog", destination: "/news", permanent: true },
  { source: "/blogs", destination: "/news", permanent: true },
  { source: "/our-team", destination: "/staff", permanent: true },
  { source: "/team", destination: "/staff", permanent: true },
  { source: "/events-calendar", destination: "/events", permanent: true },
  { source: "/events-calendar/:path*", destination: "/events", permanent: true },
  { source: "/programmes", destination: "/programs", permanent: true },
  {
    source: "/governance-and-participation-gap",
    destination: "/programs/gap",
    permanent: true,
  },
  {
    source: "/youth-organizing-and-strengthening",
    destination: "/programs/youth-organizing",
    permanent: true,
  },
  {
    source: "/communication-development-c4d",
    destination: "/programs/community-journalism",
    permanent: true,
  },
  {
    source: "/youth-climate-resilience",
    destination: "/programs/ycr",
    permanent: true,
  },
  { source: "/photo-gallery", destination: "/galleries/photos", permanent: true },
  { source: "/video-gallery", destination: "/galleries/videos", permanent: true },
  { source: "/gallery", destination: "/galleries", permanent: true },
];
