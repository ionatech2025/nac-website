# NAC Website — Database Schema Draft

**Source:** [`NAC_Rebuild_Requirements_Updated.md`](NAC_Rebuild_Requirements_Updated.md) §10 (and related rules in §8, §9, E13, B7–B9)  
**ORM:** Prisma (recommended) · **Database:** PostgreSQL  
**Executable draft:** [`packages/database/prisma/schema.prisma`](../packages/database/prisma/schema.prisma)  
**Owner:** Dev B (schema changes via PR). Dev A consumes typed data-access only.

---

## 1. Conventions both developers follow

| Rule                | Detail                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| IDs                 | `uuid` primary keys (`gen_random_uuid()` / Prisma `@default(uuid())`)                                                               |
| Timezone            | Store timestamps as `timestamptz` (UTC). **Display** public dates in `Africa/Kampala` unless an entity overrides (`Event.timezone`) |
| Publishing          | Most public content uses `ContentStatus`: `DRAFT` | `PUBLISHED` | `ARCHIVED`                                                        |
| Public reads        | Only `PUBLISHED` (and not archived). Draft/archived never leave the data-access layer to public pages                               |
| Slugs               | Unique per content type where used; immutable after publish preferred (redirect if changed)                                         |
| Media               | Files live in object storage. DB stores metadata + public URL (`MediaAsset` or typed attachment rows). **PDF and images max 2.5 MB** |
| Soft delete         | Prefer `ARCHIVED` (or inbox archive flags) over hard delete; confirm before hard delete in admin                                    |
| No revision history | Do not add version tables in v1                                                                                                     |
| Complaints          | **No** IP, user agent, referrer, cookies, geo, or visitor identifiers — ever                                                        |
| Secrets             | Connection strings and storage keys in env only                                                                                     |

### Ownership

| Dev A (frontend) | Dev B (admin / server) |
| --- | --- |
| Reads via typed query helpers (published only) | Owns Prisma schema, migrations, seed, validation |
| Requests schema changes by PR | Implements server actions, uploads, analytics, migration scripts |
| Builds against seed data | Guarantees draft content cannot leak publicly |

---

## 2. Enums

| Enum | Values | Used by |
| --- | --- | --- |
| `AdminRole` | `ADMIN` (default; extensible later) | `AdminUser` |
| `ContentStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` | Articles, programmes, spaces, staff, albums, videos, documents, partners, slideshow, featured concepts, etc. |
| `EventStatus` | `DRAFT`, `PUBLISHED`, `CANCELLED`, `ARCHIVED` | `Event` |
| `OpportunityManualStatus` | `NONE`, `CLOSED`, `ARCHIVED` | `Opportunity.manualStatus` — **derived** public status is computed (see §3) |
| `VideoProvider` | `YOUTUBE`, `VIMEO` | `VideoLink` (allowlist) |
| `InquiryArchiveState` | optional via `isArchived` boolean | `Inquiry` |
| `ComplaintStatus` | `NEW`, `REVIEWED`, `CLOSED` | `Complaint` |
| `DeviceClass` | `MOBILE`, `TABLET`, `DESKTOP`, `UNKNOWN` | Analytics |

**Do not** persist a denormalised “Open/Closed” opportunity status column as source of truth. Compute on read.

---

## 3. Opportunity derived status (application rule)

Stored fields: `openingDate`, `closingDate`, `manualStatus`.

| Result | When |
| --- | --- |
| **Archived** | `manualStatus = ARCHIVED` → hide from public list |
| **Closed** | `manualStatus = CLOSED`, **or** closing date has passed (end of day `Africa/Kampala`) |
| **Open** | Otherwise, and if `openingDate` is set it must be reached; if no closing date, stays Open until admin closes |

Implement as a shared helper in `packages/database` (or validation package) used by public queries and admin UI.

---

## 4. Entity relationship overview

```text
AdminUser

SiteSetting (key/value)
PageContent (About, privacy, …)
KeyFigure

YouthRegion 1──* YouthSpace (*──* MediaAsset via YouthSpaceImage)
Programme 1──* ProgrammeStrategy
Programme *──* Document / Article (optional later via join; v1 can be soft links)

TeamMember
Article
Opportunity 1──* OpportunityAttachment → MediaAsset
Event
PhotoAlbum 1──* PhotoImage → MediaAsset
VideoLink
Document → MediaAsset
Partner
FeaturedConcept
SlideshowImage → MediaAsset

Inquiry
Complaint          ← isolated; no FKs to visitors/analytics

AnalyticsEvent     ← short retention (optional raw)
AnalyticsDaily     ← roll-ups for dashboard
```

---

## 5. Tables (logical)

### 5.1 Auth

`AdminUser`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text | |
| email | citext/text UNIQUE | login |
| passwordHash | text | |
| role | `AdminRole` | default `ADMIN` |
| createdAt, updatedAt | timestamptz | |

v1: single row. Keep `role` for future multi-user without redesign.

---

### 5.2 Site configuration & static pages

`SiteSetting`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| key | text UNIQUE | e.g. `contact.email`, `social.facebook`, `external.youthGoBudget`, `homepage.sections` |
| value | jsonb | strings, arrays, or structured config |
| updatedAt | timestamptz | |

`PageContent`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| key | text UNIQUE | e.g. `about`, `privacy` |
| title | text | |
| body | text | sanitised HTML/Markdown source |
| updatedAt | timestamptz | |

`KeyFigure`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| label | text | e.g. “Organisations in the network” |
| value | text | store as text so “89+” works; or numeric + displayLabel |
| sortOrder | int | |
| updatedAt | timestamptz | |

---

### 5.3 Media

`MediaAsset`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| url | text | public object-storage URL |
| storageKey | text | private key/path |
| fileName | text | |
| mimeType | text | validate by content on upload |
| byteSize | int | enforce ≤ 2_621_440 (2.5 MB) for PDFs and images in the upload layer |
| width, height | int? | images |
| altText | text? | |
| createdAt | timestamptz | |

Reusable for covers, logos, gallery images, PDFs.

---

### 5.4 Organisation content

`Programme`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| title | text | |
| slug | text UNIQUE | |
| summary | text? | |
| body | text | sanitised |
| imageId | uuid? FK → MediaAsset | |
| sortOrder | int | |
| status | ContentStatus | |
| publishedAt | timestamptz? | |
| createdAt, updatedAt | timestamptz | |

`ProgrammeStrategy` — ordered strategies/activities

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| programmeId | uuid FK | cascade delete |
| title | text | |
| body | text? | |
| sortOrder | int | |

`YouthRegion`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text UNIQUE | Kampala, West Nile, … |
| sortOrder | int | |

`YouthSpace`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| regionId | uuid FK → YouthRegion | |
| name | text | |
| slug | text UNIQUE | |
| location | text? | area / place |
| description | text | |
| managingPartner | text? | |
| services | text[] | list of services/activities |
| mapUrl | text? | optional external map link (P3) |
| sortOrder | int | |
| status | ContentStatus | |
| createdAt, updatedAt | timestamptz | |

`YouthSpaceImage`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| spaceId | uuid FK | |
| mediaId | uuid FK → MediaAsset | |
| sortOrder | int | |
| caption | text? | |

`TeamMember`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text | |
| roleTitle | text | avoid SQL keyword `role` clash with AdminRole semantics |
| photoId | uuid? FK → MediaAsset | |
| biography | text? | only if NAC supplies |
| sortOrder | int | |
| status | ContentStatus | |
| createdAt, updatedAt | timestamptz | |

---

### 5.5 News & promotions

`Article`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| title | text | |
| slug | text UNIQUE | |
| excerpt | text? | |
| body | text | sanitised |
| coverImageId | uuid? FK | |
| author | text? | |
| status | ContentStatus | |
| publishedAt | timestamptz? | |
| seoTitle, seoDescription | text? | |
| ogImageId | uuid? FK | sharing image |
| viewCount | int | default 0 (P3) |
| createdAt, updatedAt | timestamptz | |

`Partner`, `FeaturedConcept`, `SlideshowImage` — as in conceptual model; each with `sortOrder`, `status`, optional `MediaAsset` / URL fields.

---

### 5.6 Opportunities & events

`OpportunityType` (editable taxonomy — B6-04)

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text UNIQUE | |
| slug | text UNIQUE | |
| sortOrder | int | |

`Opportunity`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| title | text | |
| slug | text UNIQUE | |
| typeId | uuid? FK → OpportunityType | |
| description | text | |
| openingDate | date? | |
| closingDate | date? | end-of-day Kampala when deriving |
| contactEmail | text | required for apply-by-email |
| contactPhone | text? | |
| applicationInstructions | text? | |
| manualStatus | OpportunityManualStatus | default `NONE` |
| status | ContentStatus | draft/publish for visibility of the record itself |
| viewCount | int | P3 |
| createdAt, updatedAt | timestamptz | |

`OpportunityAttachment`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| opportunityId | uuid FK | |
| mediaId | uuid FK → MediaAsset | PDF only, ≤ 2.5 MB |
| title | text? | |
| sortOrder | int | |

`Event`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| title | text | |
| slug | text UNIQUE | |
| description | text | |
| startAt, endAt | timestamptz | |
| timezone | text | default `Africa/Kampala` |
| location | text? | |
| imageId | uuid? FK | |
| registrationUrl | text? | external only |
| contact | text? | |
| status | EventStatus | |
| createdAt, updatedAt | timestamptz | |

Past vs upcoming = query on `endAt` / `startAt`, not a separate table.

---

### 5.7 Galleries & downloads

`PhotoAlbum` — title, slug?, coverMediaId?, sortOrder, status, timestamps  

`PhotoImage` — albumId, mediaId, caption, altText, sortOrder  

`VideoLink` — title, description, provider (`VideoProvider`), url, thumbnailMediaId?, sortOrder, status  

`DocumentCategory` — name, slug, sortOrder  

`Document` — title, description, categoryId?, mediaId (PDF), fileType, byteSize, publishedAt, downloadCount, status  

---

### 5.8 Public forms

`Inquiry`

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text | |
| email | text | |
| subject | text | |
| message | text | |
| isRead | boolean | default false |
| isArchived | boolean | default false |
| createdAt | timestamptz | |

`Complaint` — anonymity hard rules

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| description | text | required |
| category | text? | |
| incidentDate | date? | |
| programmeOrPlace | text? | |
| status | ComplaintStatus | default `NEW` |
| adminNotes | text? | admin-only |
| submittedOn | date | prefer **date only**, not time |
| createdAt | timestamptz | server bookkeeping; do not expose publicly; avoid logging `description` |

**Forbidden columns on `Complaint`:** ip, userAgent, referrer, sessionId, fingerprint, geo, email, name, phone, attachment.

---

### 5.9 Analytics

`AnalyticsEvent` (optional raw; short retention)

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| occurredAt | timestamptz | |
| path | text | |
| referrerHost | text? | |
| country, region, city | text? | from platform headers |
| deviceClass | DeviceClass | |
| browser, os | text? | classified then raw UA discarded |
| visitorHash | text | salted, **rotates daily** — not a stable person id |

`AnalyticsDaily` (dashboard source of truth after roll-up)

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| date | date | |
| path | text | |
| referrerHost | text? | |
| country, city | text? | |
| deviceClass | DeviceClass? | |
| browser, os | text? | |
| views | int | |
| uniqueVisitors | int | |
| UNIQUE (date, path, referrerHost, country, city, deviceClass, browser, os) | | adjust dimensions as implemented |

Never write analytics for `/admin/*` or complaint routes.

---

## 6. Indexes (minimum)

- Unique: all `slug` columns; `AdminUser.email`; `SiteSetting.key`; `PageContent.key`; taxonomy slugs  
- `status` + `sortOrder` / `publishedAt` on listable content  
- `Opportunity.closingDate`, `openingDate`, `manualStatus`  
- `Event.startAt`, `Event.endAt`, `Event.status`  
- `Inquiry.isRead`, `Inquiry.createdAt`  
- `Complaint.status`, `Complaint.submittedOn`  
- `AnalyticsDaily.date`, `AnalyticsDaily.path`  
- `AnalyticsEvent.occurredAt` (for cleanup jobs)

---

## 7. Seed expectations (Sprint 0)

1. One `AdminUser` (credentials via env / secure handoff).
2. `SiteSetting` keys for contact, social, Youth Go Budget, SLOGBAA.
3. `PageContent` keys `about`, `privacy`.
4. Key figures: organisations / youth spaces (defaults 89 / 15 pending Q3).
5. Youth regions + Appendix A spaces (flag Kunya duplicate).
6. Sample programmes (four improved names until Q1 resolved).
7. A few articles, events, opportunities, documents for Dev A UI work.
8. Seed `OpportunityType` with at least **Volunteer** (Q11); add document categories when NAC supplies the full list.
9. Empty inquiry/complaint tables; analytics empty.
10. Site setting for inquiry notification email (testing address per Q5; replace before production).

---

## 8. Out of schema (v1)

- Applicant accounts / applications  
- Event registration records  
- Content revision / restore tables  
- Multi-admin membership tables (beyond `role` field)  
- Complaint attachments  
- Third-party analytics vendor tables

---

## 9. Open vs decided items that affect data

| Item | Status | Impact |
| --- | --- | --- |
| Q1 / Q2 Programme list / GAP naming | Still open | Seed data only; programmes stay admin-managed |
| Q3 Youth space count / Kunya | Still open | Seed + `KeyFigure` values |
| Q4 Complaint retention | Still open | Maybe `deleteAfter` policy later; admin delete already supported |
| Q5 Inquiry email notification | **Decided** | Configurable notification address in `SiteSetting` (testing address for now) |
| Q6 Structure / Reports / Comments | **Decided — out of v1** | No nav-editing or extra report tables |
| Q7 Password recovery | **Decided — email** | No schema change; Auth.js (or equivalent) email reset |
| Q8 Social | **Decided — WhatsApp buttons** | No feed tables; share/contact is UI + settings URLs |
| Q10 File size cap | **Decided — 2.5 MB** | Enforced in upload layer via `MediaAsset.byteSize` |
| Q11 Opportunity types | **Partial — Volunteer** | Seed `OpportunityType`; document categories still TBD |

---

## 10. Next engineering steps

1. Dev B: add Prisma client package scripts, migrate against a local Postgres, run seed.
2. Both: agree Zod schemas mirroring these tables in `packages/validation`.
3. Dev B: publish typed `getPublished*` helpers Dev A can import.
4. Freeze breaking changes behind migrations + changelog in PRs.
