# B11 — Youth Spaces (admin)

> Admin side of Epic E6. Spaces are grouped by region (Kampala, West Nile, Western Uganda, Eastern Uganda). Starter content is requirements Appendix A. Q3: Kunya is **one** space; final count and spellings still to be confirmed by NAC, so starter spaces load as **drafts** for review. Frontend counterpart: [`../frontend/E06-youth-spaces.md`](../frontend/E06-youth-spaces.md).

## AD-B11-01 Manage regions

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-12, E6-04 |

**As the** Site Admin,  
**I want** to add, rename, reorder and remove regions,  
**so that** the public Youth Spaces page groups spaces the way NAC describes its network.

### Acceptance criteria

- [x] Regions list shows name, display order and number of spaces.
- [x] Add a region; rename it or change its order inline.
- [x] Region names are unique (clear error on a duplicate).
- [x] A region can only be deleted when it has no spaces (two-step confirm); otherwise the admin is told to move its spaces first.

---

## AD-B11-02 Create and edit a youth space

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B3-12, E6-02, E6-04, E6-06 |

**As the** Site Admin,  
**I want** to add and edit a youth space with its region, location, managing partner, description, services and map link,  
**so that** visitors see accurate, current information about each space.

### Acceptance criteria

- [x] Fields: name, slug (auto from name, editable, unique), region, location/area, managing or coordinating partner, description, services/activities (one per line), map link, display order.
- [x] Required: name, region, description. Everything else optional.
- [x] Map link must be an `http(s)` URL.
- [x] Draft → publish → unpublish → archive, like other CMS content; new spaces start as drafts.
- [x] List page: search (name, location, partner), filter by region and status, sorted by region order then space order.
- [x] Duplicate slug shows a clear error instead of failing.

---

## AD-B11-03 Space photos

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B3-12, E6-03, B7-02 |

**As the** Site Admin,  
**I want** to upload up to five photos per space with captions and alt text, and reorder them,  
**so that** the space page shows what the space looks like.

### Acceptance criteria

- [x] Upload JPEG/PNG/WebP up to 2.5 MB each (shared B07 rules; thumbnails generated).
- [x] Maximum **5** photos per space; uploads past the limit are rejected with a message.
- [x] Caption and alt text editable per photo; move up/down; remove.
- [x] The first photo is the card image on the public landing page.
- [x] Removed photos are deleted from storage (B07 cleanup).

---

## AD-B11-04 Load Appendix A starter content

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E6-05, B10 |

**As the** iONA Technical Team,  
**I want** the four regions and the Appendix A spaces loadable in one step,  
**so that** NAC starts from the improvements document instead of typing everything.

### Acceptance criteria

- [x] One-click "Load starter spaces" on the empty Youth Spaces page, and the same data in `npm run db:seed`.
- [x] Idempotent: regions matched by name, spaces by slug — re-running never duplicates or overwrites admin edits.
- [x] Kunya loaded **once** (Q3).
- [x] Starter spaces load as **drafts** so NAC reviews spellings and the final list before publishing.

---

## AD-B11-05 Public data contract for the frontend

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E6-01, E6-02, E6-03 |

**As** Dev A,  
**I want** ready-made read helpers that only return published spaces,  
**so that** the public pages can't leak drafts.

### Acceptance criteria

- [x] `listPublishedYouthRegions()` — regions in admin order, each with its published spaces (in order) and their first photo; regions with no published spaces are left out.
- [x] `getPublishedYouthSpaceBySlug(slug)` — one published space with region and all photos; `null` for drafts/archived/unknown.
- [x] Photos include `altText` and thumbnail/medium variants (`mediaVariantUrl`).
- [x] Admin saves revalidate `/youth-spaces` and `/youth-spaces/<slug>`.
