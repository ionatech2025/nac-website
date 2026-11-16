# E12 — Contact and inquiries

> Joint work: Dev A builds form UI; Dev B builds handler, storage and spam controls on the server.

## FE-E12-01 Contact details page

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E12-01, E12-02 |

**As a** visitor,  
**I want** Contact Us to show physical/postal address, phones, toll-free line and email from site settings,  
**so that** I can reach NAC offline as well as via the form.

### Acceptance criteria

- [ ] Contact fields come from site settings.
- [ ] Phone and email are clickable (`tel:` / `mailto:`) where appropriate.

---

## FE-E12-02 Contact form UI

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E12-03, E12-05 |

**As a** visitor,  
**I want** a contact form with name, email, subject and message, with validation and success/error feedback,  
**so that** I can send an inquiry confidently.

### Acceptance criteria

- [ ] Fields: name, email, subject, message.
- [ ] Client-side validation mirrors shared Zod schema for feedback only.
- [ ] Success and error states are clear.
- [ ] Includes honeypot (and CAPTCHA UI if agreed) without blocking legitimate users.
- [ ] Submits to Dev B’s handler; does not store inquiries in the browser alone.

---

## FE-E12-03 Inquiry email notification — Dev B owns delivery

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E12-06 |
| **Status** | Ready on server (Q5); no extra public UI beyond success feedback |

Public UI only needs success/error after submit. Email notification to the configured address is Dev B (see `AD-B4-04`).
