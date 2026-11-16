# B9 — Data access and security

## AD-B9-01 Typed public data-access layer

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B9-01, B9-02 |

**As** Dev A,  
**I want** typed data-access functions for every public read (published only, paginated/bounded),  
**so that** public pages can be built against a stable contract and seed data.

### Acceptance criteria

- [ ] Functions exist for each public content type used by Dev A.
- [ ] Draft, archived and unpublished content never returned to public callers.
- [ ] Lists are paginated or otherwise bounded.

---

## AD-B9-02 Validation, sanitisation and rate limits

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B9-03, B9-04, B9-05, E7-05 |

**As the** iONA Technical Team,  
**I want** server-side validation, rich-text sanitisation and rate limiting on login and public forms,  
**so that** the site resists abuse and XSS.

### Acceptance criteria

- [ ] Shared Zod (or equivalent) schemas validate all inputs server-side.
- [ ] Rich text sanitised before storage/display.
- [ ] Rate limiting on login, contact and complaint submissions.
- [ ] Consistent error responses.

---

## AD-B9-03 Transport security and headers

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B9-06, NFR-03 |

**As a** visitor,  
**I want** HTTPS-only production traffic with security headers,  
**so that** sessions and forms are protected in transit.

### Acceptance criteria

- [ ] HTTPS enforced in production.
- [ ] Sensible security headers configured for Next.js/Vercel.

---

## AD-B9-04 Backups and restore

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B9-07, NFR-07 |

**As** NAC (with iONA administering),  
**I want** database and file backups with a tested restore,  
**so that** content can be recovered after failure.

### Acceptance criteria

- [ ] Backups configured in NAC-owned accounts.
- [ ] Restore process documented and tested at least once before handover.

---

## AD-B9-05 Admin help page

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | B9-08 |

**As the** Site Admin,  
**I want** a help page with content-entry guidance and iONA support contact,  
**so that** I can manage content after handover.

### Acceptance criteria

- [ ] Help page reachable inside admin.
- [ ] Includes support contact for technical issues (not content editing by iONA).

---

## AD-B9-06 Extra reports — out of scope for v1

| | |
| --- | --- |
| **Priority** | — |
| **Requirements** | B9-09 |
| **Status** | **Out of scope** — Q6: Dashboard + Content only |

Dashboard replaces separate Reports. Do not build Structure/Configuration/Comments extras unless NAC later requests them.
