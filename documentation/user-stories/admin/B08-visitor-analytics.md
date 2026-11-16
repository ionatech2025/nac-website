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

- [ ] One event per public page view; no cookies required.
- [ ] No raw IP stored.
- [ ] Unique visitors estimated with a hashed id + daily-rotating salt (no cross-day tracking).
- [ ] Collect only: path, referrer host, geo (country/region/city), device class, browser, OS, timestamp.
- [ ] Exclude admin pages, complaint pages, known bots, and short-window duplicate refreshes.

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

- [ ] Daily summary rows power the dashboard.
- [ ] Raw rows deleted or rolled up after a short retention window.
- [ ] Cron used for roll-ups/cleanup only — **not** for closing opportunities.

---

## AD-B8-03 Content engagement counters

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
