# B10 — Content migration

> From requirements §12. Run as **local scripts** (Dev B), not as web requests (Hobby duration/body limits).

## AD-B10-01 Migrate all existing content

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | §12, 12.5.18 |

**As** NAC,  
**I want** all existing site content migrated into the new system,  
**so that** nothing useful is lost in the rebuild.

### Acceptance criteria

- [ ] Migrated: organisation profile/mission/vision, staff, programmes, articles & images, opportunities & documents, events, photo albums, videos, downloads & metadata, partners, contact details, featured concepts, slideshow images, homepage promo content.
- [ ] Original wording kept unless NAC approved changes; improvements document overrides older text where they differ.
- [ ] Original publication dates and authors kept where verified.
- [ ] Expired opportunities are not republished as Open.
- [ ] Duplicates/outdated/broken items flagged for NAC review.

---

## AD-B10-02 Load improved and new content

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | §12, E6-05, Appendix A |

**As** NAC,  
**I want** new About copy, key figures, revised programme descriptions and Youth Spaces loaded from the improvements document,  
**so that** the launch site reflects the agreed messaging.

### Acceptance criteria

- [ ] About Us + key figures seeded/updated from improvements content.
- [ ] Revised programme descriptions applied.
- [ ] Youth Spaces/regions loaded from Appendix A; Q3 issues (counts, Kunya duplicate, spellings) flagged for NAC.

---

## AD-B10-03 PDF size and URL continuity

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | §12 rules 3 and 5, E11-04, E15-03 |

**As** Dev B,  
**I want** migration to enforce the 4 MB PDF rule and preserve or redirect legacy URLs,  
**so that** downloads and old links keep working.

### Acceptance criteria

- [ ] PDFs over 4 MB are compressed/split or flagged before import.
- [ ] Legacy URLs preserved where possible; redirects created where paths change.
- [ ] Image rights confirmed; NAC-supplied brand assets used.

---

## AD-B10-04 Migration tooling

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | §12 rule 7, NFR-08 |

**As the** iONA Technical Team,  
**I want** version-controlled, repeatable migration scripts,  
**so that** imports can be re-run safely during staging.

### Acceptance criteria

- [ ] Scripts run locally against staging credentials.
- [ ] Idempotent or clearly documented re-run behaviour.
- [ ] Not executed as long-running Vercel Hobby web requests.
