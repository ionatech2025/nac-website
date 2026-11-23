import { FeaturedConcepts } from "@/components/home/featured-concepts";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { HomeContactSummary } from "@/components/home/home-contact";
import { HomeDownloads } from "@/components/home/home-downloads";
import { HomeIdentitySection } from "@/components/home/home-identity";
import { KeyFiguresStrip } from "@/components/home/key-figures";
import { LatestStories } from "@/components/home/latest-stories";
import { LatestVideos } from "@/components/home/latest-videos";
import { PartnersStrip } from "@/components/home/partners-strip";
import { YouthGoBudgetPromo } from "@/components/home/youth-go-budget";
import { getHomePageData } from "@/lib/home-data";
import { getSiteSettings } from "@/lib/site-settings";
import styles from "./home.module.css";

export default async function HomePage() {
  const [home, settings] = await Promise.all([
    getHomePageData(),
    getSiteSettings(),
  ]);

  return (
    <div className={styles.home}>
      <HeroSlideshow slides={home.slides} />
      <HomeIdentitySection identity={home.identity} />
      <KeyFiguresStrip figures={home.keyFigures} />
      <LatestStories stories={home.stories} />
      <LatestVideos videos={home.videos} />
      <FeaturedConcepts concepts={home.featuredConcepts} />
      {settings.externalServices.youthGoBudget.trim() ? (
        <YouthGoBudgetPromo href={settings.externalServices.youthGoBudget} />
      ) : null}
      <HomeDownloads downloads={home.downloads} />
      <PartnersStrip partners={home.partners} />
      <HomeContactSummary settings={settings} />
    </div>
  );
}
