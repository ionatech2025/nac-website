# E5 — Programmes

> **Note:** Final programme list is `[Open]` (Q1/Q2). Build admin-driven listing/detail so the list can change without code changes. Seed with the four improved programmes until NAC confirms.

## FE-E5-01 Programmes menu and listing

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E5-01 |

**As a** visitor,  
**I want** a programmes listing driven by admin-managed programmes,  
**so that** I can see what NAC runs without a developer updating the menu.

### Acceptance criteria

- [ ] Programs nav/listing shows published programmes in admin order.
- [ ] Adding/removing a programme in admin updates the public list without code changes.

---

## FE-E5-02 Programme detail page

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E5-02 |

**As a** visitor,  
**I want** a programme detail page with title, image, description and ordered strategies/activities,  
**so that** I understand what the programme does.

### Acceptance criteria

- [ ] Detail page shows title, image, description and ordered strategies.
- [ ] Unknown/unpublished slug returns 404.
- [ ] Content is readable on mobile.

---

## FE-E5-03 Improved programme copy and external links

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E5-03 |

**As a** visitor,  
**I want** improved programme content (GAP with links to youthgobudgetapp.org and slogbaa.org, YCR, Community Journalism, Youth Spaces),  
**so that** programme pages match the agreed messaging.

### Acceptance criteria

- [ ] GAP page surfaces external links to Youth Go Budget and SLOGBAA safely.
- [ ] Seed/migrated copy follows improvements document once available.
- [ ] Programme names remain admin-editable pending Q1/Q2.

---

## FE-E5-04 Related downloads and stories

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E5-04 |

**As a** visitor,  
**I want** related downloads and stories on a programme page,  
**so that** I can go deeper without hunting elsewhere.

### Acceptance criteria

- [ ] Related published downloads/stories render when associated data exists.
- [ ] Section is hidden or empty-stated when none exist.

---

## FE-E5-05 Link to Youth Spaces section

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E5-05 |

**As a** visitor on the Youth Spaces programme page,  
**I want** a clear link to the Youth Spaces section (Epic E6),  
**so that** I can browse the physical spaces.

### Acceptance criteria

- [ ] Youth Spaces programme page links to `/youth-spaces` (or agreed route).
