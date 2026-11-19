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

- [x] Each content type has its own list and create/edit pages. *(Sprint 1: Team, Programme, About, Key figures — pattern established)*
- [x] Publish/unpublish works without an approval workflow. *(Team + Programme; archive preferred over hard delete)*
- [x] Timestamps recorded; no version history UI. *(Prisma `createdAt` / `updatedAt` / `publishedAt`)*

**Status:** Shared pattern in place for Sprint 1 types; extend the same pattern to remaining B03 types later.

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

- [x] Full CRUD-style lifecycle with preview. *(`/admin/articles` list/new/edit; publish/unpublish/archive)*
- [x] Image, author, SEO title/description/slug/sharing image supported. *(cover required; OG optional; ≤ 2.5 MB)*
- [x] Only published articles appear publicly. *(`listPublishedArticles` / `getPublishedArticleBySlug` in `@repo/database`)*

**Status:** Done for admin + public data-access helpers. Public UI pages remain Dev A.

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

- [x] PDF-only documents; reject over 2.5 MB with a clear message. *(`save-pdf-upload.ts`)*
- [x] Metadata and category editable; publish/archive available. *(`/admin/documents`)*

**Status:** Done — public helpers `listPublishedDocuments` / `getPublishedDocumentById`.

---

## AD-B3-03 Opportunities

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-04, E8-05, §8 |

**As the** Site Admin,  
**I want** to manage opportunities (type, dates, contact, optional PDF attachments) and close/archive early,  
**so that** listings stay correct without a scheduler.

### Acceptance criteria

- [x] Admin can set type, opening/closing dates, contact email/phone, instructions, attachments.
- [x] UI shows **derived** status (Open/Closed) and allows early close/archive.
- [x] Status rules match requirements §8 (Africa/Kampala end-of-day). *(`deriveOpportunityStatus`)*
- [x] Public data-access exposes derived status to Dev A. *(`listPublishedOpportunities`)*

**Status:** Done for admin + public helpers. Public opportunities UI remains Dev A.

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

- [x] Fields: title, description, date/time, location, image, registration link, contact. *(`/admin/events`)*
- [x] Publish, cancel and archive actions available. *(`EventStatus`: DRAFT / PUBLISHED / CANCELLED / ARCHIVED)*
- [x] Times stored with Africa/Kampala default timezone handling. *(`kampala-datetime.ts`; wall times UTC+3)*

**Status:** Done for admin + public helpers (`listPublishedUpcomingEvents` / `listPublishedPastEvents` / `getPublishedEventBySlug`). Public calendar UI remains Dev A.

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

- [x] Albums: add/remove/reorder images; captions and alt text. *(`/admin/albums`; cover select; move up/down)*
- [x] Videos: store provider URL/reference (not arbitrary embed HTML); title, description, thumbnail, order, publish. *(`/admin/videos`; YouTube/Vimeo allowlist via `parseVideoUrl`)*

**Status:** Done for admin + public helpers (`listPublishedAlbums` / `getPublishedAlbumBySlug`, `listPublishedVideos` / `getPublishedVideoById`). Public gallery UI remains Dev A.

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

- [x] Programme: description, ordered strategies, order, publish. *(image upload deferred to B07)*
- [x] Youth Space & Region: name, region, location, partner, description, services, photos (max 5), order, publish. *(detailed in [B11-youth-spaces.md](B11-youth-spaces.md))*
- [x] Team Member: name, role, photo, order, publish. *(JPEG/PNG/WebP ≤ 2.5 MB; Blob or local `public/uploads`)*
- [x] About Us page body and key figure values editable.
- [x] Appendix A seed loadable for youth spaces (Q3: seed Kunya **once**; final count/spellings still to confirm). *(AD-B11-04 — loads as drafts)*

**Status:** Done — Team, Programme, About, Key figures, and Youth Spaces (B11).

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

- [x] Partner: name, logo, link, order, publish. *(`/admin/partners`)*
- [x] Slideshow: image, caption, alt, link, order, publish. *(`/admin/slideshow`)*
- [x] Featured Concept: title, summary, image, destination, order, publish. *(`/admin/featured`)*

**Status:** Done for admin + public helpers (`listPublishedPartners` / `listPublishedSlideshowImages` / `listPublishedFeaturedConcepts`). Homepage UI remains Dev A.
