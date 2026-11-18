import { BarChart3 } from "lucide-react";
import type { CountRow } from "../../../../lib/admin-insights";
import layout from "./dashboard.module.css";
import w from "./widgets.module.css";

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  search: "Search",
  social: "Social",
  other: "Referral",
};

export function BreakdownCard({
  title,
  subtitle,
  rows,
  empty,
  color = "#0b4f8a",
  prettySources = false,
}: {
  title: string;
  subtitle: string;
  rows: CountRow[];
  empty: string;
  color?: string;
  prettySources?: boolean;
}) {
  const visible = rows.filter((r) => r.count > 0).slice(0, 5);
  const total = visible.reduce((sum, r) => sum + r.count, 0);

  return (
    <section className={layout.card}>
      <header className={layout.cardHeader}>
        <div>
          <h2 className={layout.cardTitle}>{title}</h2>
          <p className={layout.cardSub}>{subtitle}</p>
        </div>
      </header>
      <div className={layout.cardBody}>
        {visible.length === 0 ? (
          <div className={layout.empty}>
            <span className={layout.emptyIcon}>
              <BarChart3 size={18} aria-hidden />
            </span>
            {empty}
          </div>
        ) : (
          <ul className={w.list}>
            {visible.map((row) => {
              const pct = total ? Math.round((row.count / total) * 100) : 0;
              const label = prettySources
                ? (SOURCE_LABELS[row.label] ?? row.label)
                : row.label;
              return (
                <li key={row.label}>
                  <div className={w.rowTop}>
                    <span className={w.rowLabel} title={label}>
                      {label}
                    </span>
                    <span className={w.rowValue}>
                      {row.count}
                      <span style={{ color: "#94a3b8", fontWeight: 500 }}>
                        {" "}
                        · {pct}%
                      </span>
                    </span>
                  </div>
                  <div className={w.track}>
                    <div
                      className={w.fill}
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
