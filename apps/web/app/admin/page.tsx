import Link from "next/link";
import { Inbox, Plus } from "lucide-react";
import { auth } from "../../auth";
import { requireAdmin } from "../../lib/require-admin";
import { getAttentionSnapshot } from "../../lib/admin-attention";
import { getInsightsSnapshot } from "../../lib/admin-insights";
import { BreakdownCard } from "./_components/dashboard/breakdown-card";
import { ComingUp } from "./_components/dashboard/coming-up";
import { ContentHealth } from "./_components/dashboard/content-health";
import { KpiCards } from "./_components/dashboard/kpi-cards";
import { QuickCreate } from "./_components/dashboard/quick-create";
import { ViewsChart } from "./_components/dashboard/views-chart";
import styles from "./_components/dashboard/dashboard.module.css";

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Kampala",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminHomePage() {
  await requireAdmin();
  const session = await auth();
  const firstName = (session?.user?.name ?? "Admin").split(" ")[0];
  const [attention, insights] = await Promise.all([
    getAttentionSnapshot(),
    getInsightsSnapshot(),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>
            {greeting()}, {firstName}
          </p>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Here&apos;s what&apos;s happening across the NAC website.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/inquiries" className={styles.btnGhost}>
            <Inbox size={15} aria-hidden />
            Inbox
          </Link>
          <Link href="/admin/articles/new" className={styles.btnPrimary}>
            <Plus size={15} aria-hidden />
            New article
          </Link>
        </div>
      </header>

      <KpiCards attention={attention} insights={insights} />

      <div className={styles.rowWide}>
        <ViewsChart daily={insights.daily} />
        <ComingUp data={attention} />
      </div>

      <div className={styles.rowThree}>
        <BreakdownCard
          title="Top pages"
          subtitle="Most viewed paths"
          rows={insights.topPages}
          empty="No page views yet."
          color="#e67e22"
        />
        <BreakdownCard
          title="Traffic sources"
          subtitle="Where visitors come from"
          rows={insights.trafficSources}
          empty="No referrer data yet."
          prettySources
        />
        <BreakdownCard
          title="Countries"
          subtitle="Visitor location"
          rows={insights.countries}
          empty="Geo data appears on Vercel."
          color="#16a34a"
        />
      </div>

      <div className={styles.rowWide}>
        <ContentHealth rows={insights.contentSummary} />
        <QuickCreate />
      </div>
    </div>
  );
}
