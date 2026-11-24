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

- [x] Contact fields come from site settings. *(seed `getContactSettings` until CMS `getPublicSiteSettings`)*
- [x] Phone and email are clickable (`tel:` / `mailto:`) where appropriate.

> **Server contract (ready, AD-B6-01):**
> - `const { contact } = await getPublicSiteSettings()` from `@repo/database`.
> - Fields: `physicalAddress`, `postalAddress`, `phone`, `phoneAlt`, `tollFree`, `email`, `whatsapp` — all strings; empty means “not set / hide”.
> - Use `tel:${phone}` / `mailto:${email}` only when the string is non-empty. `whatsapp` may be digits (`2567…`) or a full `https://wa.me/…` URL.

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

- [x] Fields: name, email, subject, message.
- [x] Client-side validation mirrors shared Zod schema for feedback only.
- [x] Success and error states are clear.
- [x] Includes honeypot (and CAPTCHA UI if agreed) without blocking legitimate users.
- [x] Submits to Dev B’s handler; does not store inquiries in the browser alone.

> **Server contract (ready, AD-B4-01):**
> - Server action: `submitInquiryAction` from `apps/web/lib/inquiry-action.ts` — use with `useActionState(submitInquiryAction, null)`.
> - Or HTTP: `POST /api/inquiries` (JSON or form data) → `201 {ok:true}` · `400 {error:"invalid"}` (unreadable body) · `422 {error:"validation", fieldErrors}` · `429 {error:"rate-limited", retryAfterSeconds}` + `Retry-After` header · `500 {error:"server"}`. Every error body is `{ok:false, error, message, …}` (`apps/web/lib/api-response.ts`, AD-B9-02); `message` is safe to show as-is.
> - Fields: `name`, `email`, `subject`, `message`; honeypot input name `website` (visually hidden, `tabIndex={-1}`, `autoComplete="off"`).
> - Shared schema/limits for client feedback: `inquirySchema`, `INQUIRY_LIMITS`, `INQUIRY_HONEYPOT_FIELD` in `apps/web/lib/inquiry-schema.ts`.

---

## FE-E12-03 Inquiry email notification — Dev B owns delivery

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E12-06 |
| **Status** | Ready on server (Q5); no extra public UI beyond success feedback |

Public UI only needs success/error after submit. Email notification to the configured address is Dev B (see `AD-B4-04`).
