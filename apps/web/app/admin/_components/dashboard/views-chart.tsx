import type { DailyPoint } from "../../../../lib/admin-insights";
import layout from "./dashboard.module.css";
import w from "./widgets.module.css";

export function ViewsChart({ daily }: { daily: DailyPoint[] }) {
  const max = Math.max(...daily.map((d) => d.views), 0);
  const total = daily.reduce((sum, d) => sum + d.views, 0);

  return (
    <section className={layout.card} aria-labelledby="views-chart-title">
      <header className={layout.cardHeader}>
        <div>
          <h2 id="views-chart-title" className={layout.cardTitle}>
            Traffic
          </h2>
          <p className={layout.cardSub}>
            Page views per day · last {daily.length} days
          </p>
        </div>
        <span className={w.kpiValue} style={{ fontSize: 20 }}>
          {total}
        </span>
      </header>
      <div className={layout.cardBody}>
        <div className={w.chart} role="img" aria-label={`${total} page views`}>
          {daily.map((d) => (
            <div
              key={d.day}
              className={max === 0 ? `${w.bar} ${w.barIdle}` : w.bar}
              style={{ height: max === 0 ? 3 : `${(d.views / max) * 100}%` }}
              title={`${d.label}: ${d.views} view${d.views === 1 ? "" : "s"}`}
            />
          ))}
          {max === 0 ? (
            <span className={w.chartNote}>No traffic recorded yet</span>
          ) : null}
        </div>
        <div className={w.chartAxis} aria-hidden>
          {daily.map((d, i) => (
            <span key={d.day}>{i % 2 === 0 ? d.label : ""}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
