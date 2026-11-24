import type { MetadataRoute } from "next";
import { listAllPublicEvents } from "@/lib/events-data";
import { listArticlesPage } from "@/lib/news-data";
import { listOpportunities } from "@/lib/opportunities-data";
import { listProgrammes } from "@/lib/programmes-data";
import { absoluteUrl } from "@/lib/share-links";
import { listYouthRegions } from "@/lib/youth-spaces-data";

const STATIC_PATHS = [
  "/",
  "/about",
  "/staff",
  "/programs",
  "/youth-spaces",
  "/news",
  "/opportunities",
  "/events",
  "/events/archive",
  "/galleries",
  "/galleries/photos",
  "/galleries/videos",
  "/downloads",
  "/contact",
  "/privacy",
];

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

/** Public XML sitemap — excludes /admin and /complaints (E15-02). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, programmes, opportunities, events, regions] =
    await Promise.all([
      listArticlesPage({ page: 1, pageSize: 100 }),
      listProgrammes(),
      listOpportunities(),
      listAllPublicEvents(),
      listYouthRegions(),
    ]);

  const dynamic: MetadataRoute.Sitemap = [
    ...articles.items.map((article) =>
      entry(`/news/${article.slug}`, "weekly", 0.7),
    ),
    ...programmes.map((programme) =>
      entry(`/programs/${programme.slug}`, "monthly", 0.7),
    ),
    ...opportunities.map((item) =>
      entry(`/opportunities/${item.slug}`, "weekly", 0.6),
    ),
    ...events.map((event) => entry(`/events/${event.slug}`, "weekly", 0.6)),
    ...regions.flatMap((region) =>
      region.spaces.map((space) =>
        entry(`/youth-spaces/${space.slug}`, "monthly", 0.6),
      ),
    ),
  ];

  return [
    ...STATIC_PATHS.map((path) =>
      entry(path, path === "/" ? "daily" : "weekly", path === "/" ? 1 : 0.8),
    ),
    ...dynamic,
  ];
}
