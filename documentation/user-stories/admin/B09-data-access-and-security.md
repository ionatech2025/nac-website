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

- [x] Functions exist for each public content type used by Dev A. *(`packages/database/src/public-*.ts`, all exported from `@repo/database`; new `public-organisation.ts` covers team, programmes + strategies, About page content, key figures and opportunity-type chips; `listDocumentCategoriesInUse` for download filters. Page-by-page map in `frontend/00-overview.md` → "Data contract")*
- [x] Draft, archived and unpublished content never returned to public callers. *(every query filters `status: "PUBLISHED"`; detail helpers use `findFirst({ slug, status })` so a draft slug returns `null`. Verified with temporary draft/archived/published rows: only the published ones came back)*
- [x] Lists are paginated or otherwise bounded. *(`pagination.ts`: every `take` goes through `boundedTake` → max 100 whatever the caller passes; the long lists (news, past events, albums, downloads) have `…Page({ page, pageSize })` variants returning `{ items, page, pageSize, total, pageCount }`)*

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

- [x] Shared Zod (or equivalent) schemas validate all inputs server-side. *(every admin server action parses `FormData` with Zod before touching the DB; public forms share `inquiry-schema.ts` / `complaint-schema.ts` between the server action and the API route; login credentials are length-capped in `auth.ts`)*
- [x] Rich text sanitised before storage/display. *(`lib/rich-text.ts`: `richText()` / `optionalRichText()` Zod fields strip all HTML, scripts, comments and control characters **before storage**; `<RichText>` (`lib/rich-text-view.tsx`) renders the light text conventions as React elements on **display** — no `dangerouslySetInnerHTML`, links are https-only with `rel="noopener noreferrer"`. Admin long-text fields show the formatting hint)*
- [x] Rate limiting on login, contact and complaint submissions. *(login: 5 failures / 10 min → 15-min lock, `login-rate-limit.ts`; contact 5 / 10 min and complaints 3 / 30 min, `form-rate-limit.ts`)*
- [x] Consistent error responses. *(`lib/api-response.ts`: every public API error is `{ ok:false, error, message, …details }` with fixed codes `invalid` 400 · `unexpected-fields` 400 · `validation` 422 (+ `fieldErrors`) · `rate-limited` 429 (+ `Retry-After`) · `server` 500; used by `/api/inquiries`, `/api/complaints`, `/api/analytics/view`)*

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

- [x] HTTPS enforced in production. *(Vercel redirects HTTP → HTTPS on every domain, free on Hobby; we add `Strict-Transport-Security: max-age=63072000; includeSubDomains` and CSP `upgrade-insecure-requests` in production builds only, so local `http://localhost` keeps working)*
- [x] Sensible security headers configured for Next.js/Vercel. *(`apps/web/security-headers.js`, applied site-wide in `next.config.js`: Content-Security-Policy (self + Vercel Blob + YouTube/Vimeo/Google embeds, `frame-ancestors 'none'`, `object-src 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`; `X-Powered-By` removed. Verified with `curl -I` and the admin still hydrates under the CSP)*

---

##  AD-B9-04 Backups and restore [LATER]

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
**I want** a help page with content-entry guidance and iONA support contact (support@ionatec.com | 2060iona.shemuel@gmail.com),  
**so that** I can manage content after handover.

### Acceptance criteria

- [x] Help page reachable inside admin. *(`/admin/help`, sidebar "Support → Help & support"; topics: publishing workflow, writing long text, images & PDFs (limits read from `MAX_UPLOAD_BYTES`), articles/events/opportunities, team/programmes/youth spaces, inbox & complaints, signing in safely. Content lives in `help/help-content.ts`)*
- [x] Includes support contact for technical issues (not content editing by iONA). *(support card with both mailto links, what to include when reporting, and "iONA looks after the technical side only")*

---

## AD-B9-06 Extra reports — out of scope for v1

| | |
| --- | --- |
| **Priority** | — |
| **Requirements** | B9-09 |
| **Status** | **Out of scope** — Q6: Dashboard + Content only |

Dashboard replaces separate Reports. Do not build Structure/Configuration/Comments extras unless NAC later requests them.
