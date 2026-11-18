import type { ContentTypeSummary } from "../../../../lib/admin-insights";
import layout from "./dashboard.module.css";
import w from "./widgets.module.css";

export function ContentHealth({ rows }: { rows: ContentTypeSummary[] }) {
  const totals = rows.reduce(
    (acc, r) => ({
      live: acc.live + r.published,
      draft: acc.draft + r.draft,
      arch: acc.arch + r.archived,
    }),
    { live: 0, draft: 0, arch: 0 },
  );

  return (
    <section className={layout.card} aria-labelledby="content-health-title">
      <header className={layout.cardHeader}>
        <div>
          <h2 id="content-health-title" className={layout.cardTitle}>
            Content
          </h2>
          <p className={layout.cardSub}>
            {totals.live} live · {totals.draft} draft · {totals.arch} archived
          </p>
        </div>
        <div className={w.legend}>
          <span>
            <i className={`${w.dot} ${w.segLive}`} />
            Live
          </span>
          <span>
            <i className={`${w.dot} ${w.segDraft}`} />
            Draft
          </span>
          <span>
            <i className={`${w.dot} ${w.segArch}`} />
            Archived
          </span>
        </div>
      </header>
      <div className={layout.cardBody}>
        <ul className={w.list}>
          {rows.map((r) => {
            const total = r.published + r.draft + r.archived;
            const pct = (n: number) => (total ? `${(n / total) * 100}%` : "0%");
            return (
              <li key={r.type}>
                <div className={w.rowTop}>
                  <span className={w.rowLabel}>{r.type}</span>
                  <span className={w.rowValue}>{total}</span>
                </div>
                <div
                  className={w.segments}
                  title={`${r.published} live, ${r.draft} draft, ${r.archived} archived`}
                >
                  <div className={w.segLive} style={{ width: pct(r.published) }} />
                  <div className={w.segDraft} style={{ width: pct(r.draft) }} />
                  <div className={w.segArch} style={{ width: pct(r.archived) }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
