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

- [ ] Clear instructions and anonymity statement above the form.
- [ ] On success, a confirmation message is shown (no email acknowledgement).
- [ ] Page is linked from Contact grouping in navigation.

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

- [ ] Fields: description (required); optional category/subject, incident date, programme/place.
- [ ] **No** name, email, phone or other identity fields in the UI.
- [ ] No file attachment control in v1.
- [ ] Client validation for required description only.
- [ ] Spam controls (honeypot / CAPTCHA UI) do not collect identity for storage.
- [ ] Form posts to Dev B’s anonymous handler.

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

- [ ] Complaint routes do not load visitor analytics scripts.
- [ ] No marketing/tracking cookies set on these pages from the public UI.
- [ ] Coordinate with Dev B exclusions (analytics, robots, logging).
