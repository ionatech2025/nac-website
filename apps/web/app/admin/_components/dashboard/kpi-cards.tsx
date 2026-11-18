import Link from "next/link";
import { Eye, Mail, MessageSquareWarning, Users } from "lucide-react";
import type { AttentionSnapshot } from "../../../../lib/admin-attention";
import type { InsightsSnapshot } from "../../../../lib/admin-insights";
import layout from "./dashboard.module.css";
import w from "./widgets.module.css";

const nf = new Intl.NumberFormat("en-GB");

export function KpiCards({
  attention,
  insights,
}: {
  attention: AttentionSnapshot;
  insights: InsightsSnapshot;
}) {
  return (
    <div className={layout.kpis}>
      <div className={w.kpi}>
        <div className={w.kpiTop}>
          <span className={w.kpiLabel}>Page views</span>
          <span className={`${w.chip} ${w.chipBlue}`}>
            <Eye size={16} aria-hidden />
          </span>
        </div>
        <span className={w.kpiValue}>{nf.format(insights.totalViews)}</span>
        <span className={w.kpiFoot}>Last {insights.periodDays} days</span>
      </div>

      <div className={w.kpi}>
        <div className={w.kpiTop}>
          <span className={w.kpiLabel}>Visitors</span>
          <span className={`${w.chip} ${w.chipGreen}`}>
            <Users size={16} aria-hidden />
          </span>
        </div>
        <span className={w.kpiValue}>{nf.format(insights.visitors)}</span>
        <span className={w.kpiFoot}>Daily unique, summed</span>
      </div>

      <Link href="/admin/inquiries" className={w.kpi}>
        <div className={w.kpiTop}>
          <span className={w.kpiLabel}>New inquiries</span>
          <span className={`${w.chip} ${w.chipOrange}`}>
            <Mail size={16} aria-hidden />
          </span>
        </div>
        <span className={w.kpiValue}>{attention.newInquiryCount}</span>
        <span className={w.kpiFoot}>Unread in inbox</span>
      </Link>

      <Link href="/admin/complaints" className={w.kpi}>
        <div className={w.kpiTop}>
          <span className={w.kpiLabel}>New complaints</span>
          <span className={`${w.chip} ${w.chipRed}`}>
            <MessageSquareWarning size={16} aria-hidden />
          </span>
        </div>
        <span className={w.kpiValue}>{attention.newComplaintCount}</span>
        <span className={w.kpiFoot}>Awaiting review</span>
      </Link>
    </div>
  );
}
