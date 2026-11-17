# B2 — Admin dashboard

## AD-B2-01 Visitor counts and trends

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B2-01, B2-02 |
| **Depends on** | B8 analytics collection |

**As the** Site Admin,  
**I want** total visits, unique visitors and page views for today, last 7 days, last 30 days and all time, with a trend chart,  
**so that** I can see reach and growth.

### Acceptance criteria

- [ ] Dashboard shows visits, unique visitors and page views for the stated periods.
- [ ] A trend chart visualises change over time.
- [ ] Data comes from first-party analytics (no third-party ad trackers).

---

## AD-B2-02 Attention list and quick links

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B2-09, B2-11, B2-12 |

**As the** Site Admin,  
**I want** an attention list (new inquiries, new complaints count, opportunities closing soon, upcoming events) and quick create links,  
**so that** I know what needs action after login.

### Acceptance criteria

- [x] Attention list includes new inquiries, complaint **count only** (never complaint text), opportunities closing soon, upcoming events. *(`lib/admin-attention.ts`; complaints via `count` only)*
- [x] Quick links to create article, download, opportunity, event, team member, etc. *(`lib/admin-quick-links.ts` → stub create routes)*
- [x] Dashboard is the landing page after login. *(`/admin` after Auth.js `redirectTo`; brand link in layout)*

**Status:** Done — create/inbox UIs remain stubs until B03–B05; visitor charts are AD-B2-01 / B08.

---

## AD-B2-03 Deeper visitor insights

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B2-03, B2-04, B2-05, B2-06, B2-08 |

**As the** Site Admin,  
**I want** most-visited pages, traffic sources, country/city, device/browser/OS and content summary counts,  
**so that** I understand the audience beyond raw totals.

### Acceptance criteria

- [x] Top 10 pages for agreed periods. *(last 30 days from `AnalyticsDaily` roll-ups + today's raw events, AD-B8-02)*
- [x] Traffic sources grouped by referrer host class (direct, search, social, other).
- [x] Country (and city where available) from geo headers. *(Vercel `x-vercel-ip-`*; empty locally)*
- [x] Device class, browser, OS summaries.
- [x] Content summary: published vs draft counts by type. *(+ archived column)*

**Status:** Done with B08-01 collector. Trend totals (AD-B2-01) and daily roll-ups (AD-B8-02) still open.

---

## AD-B2-04 Optional engagement metrics [Put it for Future]

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | B2-07, B2-10 |

**As the** Site Admin,  
**I want** most downloaded documents, most viewed articles/opportunities, and recently updated content,  
**so that** I can prioritise popular materials.

### Acceptance criteria

- [ ] Optional widgets render when counters exist.
- [ ] Recently updated content list is available if implemented.
