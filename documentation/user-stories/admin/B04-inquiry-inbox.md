# B4 — Inquiry inbox

## AD-B4-01 Store and list inquiries

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B4-01, B4-02, E12-04 |

**As the** Site Admin,  
**I want** submitted contact-form inquiries stored and listed with date, name, subject and read/unread state,  
**so that** I can respond to people who contacted NAC.

### Acceptance criteria

- [x] Public contact form handler validates and stores inquiries. *(`POST /api/inquiries` + `submitInquiryAction` → `lib/submit-inquiry.ts`; shared Zod schema `lib/inquiry-schema.ts`; honeypot field `website`; 5 submissions / 10 min per IP via `lib/form-rate-limit.ts`)*
- [x] List shows date, name, subject, read/unread. *(`/admin/inquiries`; unread dot + bold; sidebar unread badge)*
- [x] Detail view shows full message and contact fields. *(`/admin/inquiries/[id]`; reply via `mailto:`)*
- [x] Only authenticated admin can access. *(proxy + `requireAdmin` on pages, `assertAdminSession` on every action)*

---

## AD-B4-02 Manage inquiry state

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B4-03 |

**As the** Site Admin,  
**I want** to mark inquiries read/unread, archive and delete them,  
**so that** my inbox stays workable.

### Acceptance criteria

- [x] Mark read/unread works. *(opening marks read; "Mark as unread"; "Mark all as read")*
- [x] Archive and delete available with confirmation on delete. *(archive / move to inbox; two-step `ConfirmDelete`)*

---

## AD-B4-03 Search and filter inquiries

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | B4-04 |

**As the** Site Admin,  
**I want** to search and filter inquiries by date or state,  
**so that** I can find older messages.

### Acceptance criteria

- [x] Filter/search by date range and read state (and optional text search if implemented). *(tabs Inbox / Unread / Read / Archived; Kampala date range; text search over name, email, subject, message; 25 per page; all state in the URL)*

---

## AD-B4-04 Inquiry email notification [LATER]

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E12-06 |
| **Status** | Ready — Q5 decided (notify; testing address for now) |

**As the** Site Admin,  
**I want** an email when a new inquiry arrives,  
**so that** I notice contact-form messages without checking the portal constantly.

### Acceptance criteria

- [ ] On successful inquiry submit, send notification to the configured address in site settings.
- [ ] Testing may use the temporary address from Q5; replace with the production NAC address before launch.
- [ ] Notification failure must not lose the stored inquiry (log/retry separately; never log complaint content).
