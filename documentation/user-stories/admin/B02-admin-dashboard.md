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

- [ ] Attention list includes new inquiries, complaint **count only** (never complaint text), opportunities closing soon, upcoming events.
- [ ] Quick links to create article, download, opportunity, event, team member, etc.
- [ ] Dashboard is the landing page after login.

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

- [ ] Top 10 pages for agreed periods.
- [ ] Traffic sources grouped by referrer host class (direct, search, social, other).
- [ ] Country (and city where available) from geo headers.
- [ ] Device class, browser, OS summaries.
- [ ] Content summary: published vs draft counts by type.

---

## AD-B2-04 Optional engagement metrics

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
