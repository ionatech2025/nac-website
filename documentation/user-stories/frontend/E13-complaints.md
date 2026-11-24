# E13 — Complaints (anonymous) — public UI

> Anonymity is critical. UI must never ask for identity. Dev B enforces no IP/UA/analytics on these pages.

## FE-E13-01 Complaints page and instructions

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E13-01, E13-03 |

**As a** complainant,  
**I want** a dedicated complaints page that explains the process and that complaints are anonymous,  
**so that** I understand what is and is not recorded before I submit.

### Acceptance criteria

- [x] Clear instructions and anonymity statement above the form, including that complaints are **deleted automatically after 30 days** (Q4).
- [x] On success, a confirmation message is shown (no email acknowledgement).
- [x] Page is linked from Contact grouping in navigation.

---

## FE-E13-02 Anonymous complaint form UI

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E13-02, E13-05, E13-07 |

**As a** complainant,  
**I want** to submit a complaint without giving my name or contact details,  
**so that** I am not exposed.

### Acceptance criteria

- [x] Fields: description (required); optional category/subject, incident date, programme/place.
- [x] **No** name, email, phone or other identity fields in the UI.
- [x] No file attachment control in v1.
- [x] Client validation for required description only. *(plus optional-field rules from shared schema)*
- [x] Spam controls (honeypot / CAPTCHA UI) do not collect identity for storage.
- [x] Form posts to Dev B’s anonymous handler. *(`submitComplaintAction`)*

> **Server contract (ready, AD-B5-04):**
> - Server action: `submitComplaintAction` from `apps/web/lib/complaint-action.ts` — use with `useActionState(submitComplaintAction, null)`.
> - Or HTTP: `POST /api/complaints` (JSON or form data) → `201 {ok:true}` · `422 {error:"validation", fieldErrors}` · `400 {error:"unexpected-fields"}` (any extra field, e.g. name/email, is rejected) · `429 {error:"rate-limited", retryAfterSeconds}` + `Retry-After` header · `500 {error:"server"}` · `400 {error:"invalid"}` for an unreadable body. Every error body is `{ok:false, error, message, …}` (`apps/web/lib/api-response.ts`, AD-B9-02).
> - Fields: `description` (required, 10–5000), optional `category`, `incidentDate` (`YYYY-MM-DD`, not in the future), `programmeOrPlace`; honeypot input name `website`.
> - Suggested category options: `COMPLAINT_CATEGORIES` in `apps/web/lib/complaint-schema.ts` (free text also accepted).
> - Put the page at a path containing `complaint` (e.g. `/complaints`): analytics skip it and `next.config.js` adds `no-referrer`, `noindex` and `no-store` headers automatically.

---

## FE-E13-03 No tracking affordances on complaint pages

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E13-04 |

**As a** complainant,  
**I want** complaint pages free of tracking cookies and analytics scripts,  
**so that** my visit is not tied to a complaint.

### Acceptance criteria

- [x] Complaint routes do not load visitor analytics scripts. *(`AnalyticsBeacon` skips paths containing `complaint`)*
- [x] No marketing/tracking cookies set on these pages from the public UI.
- [x] Coordinate with Dev B exclusions (analytics, robots, logging). *(`robots: noindex` metadata + complaint headers in `next.config.js`)*
