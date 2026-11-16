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

- [ ] List view: date, category, status (new/reviewed/closed).
- [ ] Detail view: submitted fields only (description, optional category, incident date, programme/place).
- [ ] **No** IP, user agent, referrer, cookies, device or location stored or shown with a complaint.
- [ ] Complaint data never returned by public routes; never in analytics, exports or application logs.
- [ ] Complaint pages excluded from visitor analytics collection.

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

- [ ] Status transitions among new / reviewed / closed.
- [ ] Private admin notes stored; never shown publicly.

---

## AD-B5-03 Retention and deletion — partially blocked

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B5-06 |
| **Status** | Manual delete **in scope**; automatic retention **Blocked** (Q4) |

**As the** Site Admin,  
**I want** to delete a complaint,  
**so that** sensitive text is not kept longer than needed.

### Acceptance criteria

- [ ] Admin can delete a complaint with confirmation.
- [ ] Automatic retention period waits on NAC decision (Q4).

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

- [ ] Handler accepts only allowed fields; rejects identity fields if sent.
- [ ] Spam controls do not persist identifying data linked to the complaint.
- [ ] Prefer storing submission **date** only (not exact time) where practical (P2 enhancement).
- [ ] No file attachments in v1.
