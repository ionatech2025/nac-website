# B5 — Complaints inbox (restricted and anonymous)

## AD-B5-01 Receive and view anonymous complaints

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B5-01, B5-02, B5-04, B5-05, E13-04 |

**As the** Site Admin,  
**I want** to see each complaint with its date and submitted details in a restricted inbox,  
**so that** I can review concerns without ever seeing who submitted them.

### Acceptance criteria

- [x] List view: date, category, status (new/reviewed/closed). *(`/admin/complaints`; status tabs with counts, category + submitted-date filters, text search, 25 per page; sidebar badge shows the NEW count only)*
- [x] Detail view: submitted fields only (description, optional category, incident date, programme/place). *(`/admin/complaints/[id]`)*
- [x] **No** IP, user agent, referrer, cookies, device or location stored or shown with a complaint. *(schema has no such columns; handler never reads them; `createdAt` is forced to the submission date)*
- [x] Complaint data never returned by public routes; never in analytics, exports or application logs. *(public API returns only `{ok}`/error codes; no public read helpers; errors log only a Prisma code; dashboard shows counts only; no exports exist)*
- [x] Complaint pages excluded from visitor analytics collection. *(beacon + `shouldTrackPath` skip any path containing `complaint`; `next.config.js` sends `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex`, `Cache-Control: no-store` on those paths)*

---

## AD-B5-02 Status and private notes

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B5-03 |

**As the** Site Admin,  
**I want** to change complaint status and add private notes,  
**so that** I can track internal follow-up without contacting the complainant.

### Acceptance criteria

- [x] Status transitions among new / reviewed / closed. *(segmented control in the detail aside; any transition allowed)*
- [x] Private admin notes stored; never shown publicly. *(`adminNotes`, max 5,000 chars; admin-only page and action)*

---

## AD-B5-03 Retention and deletion

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B5-06 |
| **Status** | Done — Q4 decided: **30 days** after submission |

**As the** Site Admin,  
**I want** to delete a complaint,  
**so that** sensitive text is not kept longer than needed.

### Acceptance criteria

- [x] Admin can delete a complaint with confirmation. *(two-step `ConfirmDelete`; hard delete incl. notes)*
- [x] Automatic retention: complaints (and their notes) are deleted **30 days after submission** (Q4). *(`lib/complaint-retention.ts`; daily Vercel Cron `/api/cron/complaint-retention` at 00:00 UTC, protected by `CRON_SECRET`; also purged lazily whenever an admin opens complaint pages; list shows "Deletes in Nd" in the final week; detail shows the auto-delete date)*

---

## AD-B5-04 Anonymous submission handler

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E13-02, E13-05, E13-06 |

**As a** complainant (via the public form),  
**I want** my submission stored without identifying metadata,  
**so that** anonymity holds end-to-end.

### Acceptance criteria

- [x] Handler accepts only allowed fields; rejects identity fields if sent. *(`POST /api/complaints` + `submitComplaintAction` → `lib/submit-complaint.ts`; `z.strictObject` in `lib/complaint-schema.ts` → `400 unexpected-fields`)*
- [x] Spam controls do not persist identifying data linked to the complaint. *(honeypot `website`; in-memory limit 3 / 30 min keyed by a salted SHA-256 of the IP with a per-process random salt — never stored, never linked to the row)*
- [x] Prefer storing submission **date** only (not exact time) where practical (P2 enhancement). *(`submittedOn` = Kampala date; `createdAt` overridden to the same midnight)*
- [x] No file attachments in v1. *(no file field accepted; non-string form values dropped)*
