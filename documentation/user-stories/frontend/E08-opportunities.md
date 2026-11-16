# E8 — Opportunities

> Applicants apply **by email outside the site**. No application form. Status is derived server-side (Dev B); UI must display Open/Closed correctly.

## FE-E8-01 Opportunities listing

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E8-01, E8-02 |

**As a** visitor,  
**I want** an opportunities listing with title, description, type and dates,  
**so that** I can see what is available.

### Acceptance criteria

- [ ] Lists non-archived published opportunities.
- [ ] Shows title, type, opening/closing dates and short description.
- [ ] Attached PDFs are discoverable on the detail/card as agreed.

---

## FE-E8-02 Opportunity detail with contact to apply

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E8-02, E8-03, E8-04 |

**As an** applicant,  
**I want** contact information and a mailto link with a prefilled subject on each opportunity,  
**so that** I can apply by email outside the site.

### Acceptance criteria

- [ ] Detail shows email, optional phone and application instructions.
- [ ] Email is a `mailto:` link; subject includes the opportunity title.
- [ ] No in-site application form exists.

---

## FE-E8-03 Filters by status, type and closing date

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E8-06 |

**As a** visitor,  
**I want** to filter opportunities by status (open/closed), type and closing date,  
**so that** I can find relevant openings quickly.

### Acceptance criteria

- [ ] Filters for status, type and closing date (range or sort) work together.
- [ ] Filter state is clear in the UI (and URL where practical).
- [ ] Results update without broken empty states.

---

## FE-E8-04 Closed opportunities labelling

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E8-07 |

**As an** applicant,  
**I want** closed opportunities to stay visible but clearly labelled and not offered as apply-now,  
**so that** I do not try to apply after the deadline.

### Acceptance criteria

- [ ] Closed items are labelled Closed.
- [ ] Apply/mailto CTA is hidden or disabled for closed items.
- [ ] Open items remain clearly actionable.
