# B8 — Visitor analytics collection

## AD-B8-01 Privacy-preserving page-view events

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B8-01, B8-02, B8-03, B8-04 |

**As the** Site Admin,  
**I want** lightweight page-view events without cookies or raw IP storage,  
**so that** I get visitor counts without tracking individuals.

### Acceptance criteria

- [x] One event per public page view; no cookies required. *(*`AnalyticsBeacon` *+* `POST /api/analytics/view`*)*
- [x] No raw IP stored. *(only hashed contribution inside* `visitorHash`*)*
- [x] Unique visitors estimated with a hashed id + daily-rotating salt (no cross-day tracking).
- [x] Collect only: path, referrer host, geo (country/region/city), device class, browser, OS, timestamp.
- [x] Exclude admin pages, complaint pages, known bots, and short-window duplicate refreshes. *(~30s dedupe)*

**Status:** Collector live. Daily roll-ups / cleanup: AD-B8-02.

---

## AD-B8-02 Daily roll-ups and cleanup

| | |
| --- | --- |
| **Priority** | P1 / P2 |
| **Requirements** | B8-05, B8-07 |

**As the** iONA Technical Team,  
**I want** daily summaries and cleanup via the once-a-day Hobby cron,  
**so that** the free database stays within limits.

### Acceptance criteria

- [x] Daily summary rows power the dashboard. *(*`AnalyticsDaily` *+ per-day* `AnalyticsDayTotal` *for true distinct visitors; dashboard adds raw events only for days not yet rolled up, normally today —* `lib/analytics/view-rows.ts`*)*
- [x] Raw rows deleted or rolled up after a short retention window. *(raw* `AnalyticsEvent` *kept **7 days**, deleted only once its day is rolled up —* `lib/analytics/rollup.ts`*)*
- [x] Cron used for roll-ups/cleanup only — **not** for closing opportunities. *(*`/api/cron/analytics-rollup` *daily 00:15 UTC; opportunity status stays derived at read time)*

### Implementation notes

- Days are **UTC** because the visitor hash rotates at UTC midnight; Kampala days would double-count visitors across 03:00.
- Missed cron runs catch up automatically (up to 60 days back). A day is never rolled up twice, since its raw rows may already be purged.
- All three crons (complaint retention, analytics roll-up, media cleanup) run once a day, within Hobby limits, and share `CRON_SECRET`.

**Status:** Done. Verified by seeding events 10 and 2 days back: dashboard totals identical before and after roll-up + purge; 10-day-old raw rows deleted, 2-day-old kept; second run is a no-op.

---

## AD-B8-03 Content engagement counters[ LATER]

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | B8-06 |

**As the** Site Admin,  
**I want** download and article/opportunity view counters,  
**so that** popular content is visible on the dashboard.

### Acceptance criteria

- [ ] Document downloads counted.
- [ ] Article/opportunity views counted when implemented.
- [ ] Counters never applied to complaint flows.
