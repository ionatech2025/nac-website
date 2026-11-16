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

- [ ] Public contact form handler validates and stores inquiries.
- [ ] List shows date, name, subject, read/unread.
- [ ] Detail view shows full message and contact fields.
- [ ] Only authenticated admin can access.

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

- [ ] Mark read/unread works.
- [ ] Archive and delete available with confirmation on delete.

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

- [ ] Filter/search by date range and read state (and optional text search if implemented).

---

## AD-B4-04 Inquiry email notification — blocked

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | E12-06 |
| **Status** | **Blocked** — open question Q5 |

Implement only after NAC confirms email notification and destination address.
