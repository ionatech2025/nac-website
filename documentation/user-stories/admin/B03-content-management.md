# B3 — Content management (one page per content type)

**Shared rules for every content type below**

- List page: search, sort, filter, pagination where useful.
- Create/edit page: server-side validation, preview, publish/unpublish.
- Confirm before delete; prefer archive over hard delete.
- Draft and published states; admin publishes directly (no approval) — B3-14.
- Creation and last-updated timestamps — B3-15.
- **No** revision history or restore — B3-16 (out of scope).

---

## AD-B3-00 Shared CMS patterns

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-14, B3-15, B3-16 |

**As the** Site Admin,  
**I want** consistent list/edit/publish behaviour across content types,  
**so that** I can manage the site without learning a different pattern each time.

### Acceptance criteria

- [ ] Each content type has its own list and create/edit pages.
- [ ] Publish/unpublish works without an approval workflow.
- [ ] Timestamps recorded; no version history UI.

---

## AD-B3-01 Blog / News articles

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-01 |

**As the** Site Admin,  
**I want** to create, edit, preview, publish, unpublish and archive articles with image, author and SEO fields,  
**so that** news stays current.

### Acceptance criteria

- [ ] Full CRUD-style lifecycle with preview.
- [ ] Image, author, SEO title/description/slug/sharing image supported.
- [ ] Only published articles appear publicly.

---

## AD-B3-02 Downloads

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-02, B7-01 |

**As the** Site Admin,  
**I want** to upload/replace PDFs (max 2.5 MB), edit metadata/category and publish/archive,  
**so that** the document library stays accurate.

### Acceptance criteria

- [ ] PDF-only documents; reject over 2.5 MB with a clear message.
- [ ] Metadata and category editable; publish/archive available.

---

## AD-B3-03 Opportunities

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-04, E8-05, §8 |

**As the** Site Admin,  
**I want** to manage opportunities (type, dates, contact, PDF attachments) and close/archive early,  
**so that** listings stay correct without a scheduler.

### Acceptance criteria

- [ ] Admin can set type, opening/closing dates, contact email/phone, instructions, attachments.
- [ ] UI shows **derived** status (Open/Closed) and allows early close/archive.
- [ ] Status rules match requirements §8 (Africa/Kampala end-of-day).
- [ ] Public data-access exposes derived status to Dev A.

---

## AD-B3-04 Events

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-10 |

**As the** Site Admin,  
**I want** to manage upcoming events including registration URL, cancel and archive,  
**so that** the calendar stays accurate.

### Acceptance criteria

- [ ] Fields: title, description, date/time, location, image, registration link, contact.
- [ ] Publish, cancel and archive actions available.
- [ ] Times stored with Africa/Kampala default timezone handling.

---

## AD-B3-05 Photo albums and video links

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-06, B3-11, E10-04 |

**As the** Site Admin,  
**I want** to manage photo albums (images, captions, alt, order) and video links from allowlisted providers,  
**so that** galleries stay fresh.

### Acceptance criteria

- [ ] Albums: add/remove/reorder images; captions and alt text.
- [ ] Videos: store provider URL/reference (not arbitrary embed HTML); title, description, thumbnail, order, publish.

---

## AD-B3-06 Programmes, Youth Spaces, Team, About

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-07, B3-09, B3-12, B3-13, E6-04, E6-05 |

**As the** Site Admin,  
**I want** to manage programmes, youth spaces/regions, team members, About Us and key figures,  
**so that** organisational content stays accurate without developer help.

### Acceptance criteria

- [ ] Programme: description, image, ordered strategies, order, publish.
- [ ] Youth Space & Region: name, region, location, partner, description, services, photos, order, publish.
- [ ] Team Member: name, role, photo, order, publish.
- [ ] About Us page body and key figure values editable.
- [ ] Appendix A seed loadable for youth spaces (pending Q3 cleanup).

---

## AD-B3-07 Partners, slideshow, featured concepts

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B3-03, B3-05, B3-08 |

**As the** Site Admin,  
**I want** to manage partners, slideshow images and featured concepts,  
**so that** homepage promotional areas stay current.

### Acceptance criteria

- [ ] Partner: name, logo, link, order, publish.
- [ ] Slideshow: image, caption, alt, link, order, publish.
- [ ] Featured Concept: title, summary, image, destination, order, publish.
