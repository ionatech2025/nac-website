# E6 — Youth Spaces

> New public section. Spaces grouped by region: Kampala, West Nile, Western Uganda, Eastern Uganda. Seed content in requirements Appendix A. Q3: Kunya is **one** space (don't list it twice); treat the total count as provisional. Admin side: [`../admin/B11-youth-spaces.md`](../admin/B11-youth-spaces.md).

## Server contract (ready — Dev B)

Import from `@repo/database` in server components. Both helpers return **published** content only.

| Helper | Returns |
| --- | --- |
| `listPublishedYouthRegions()` | `[{ id, name, spaces: [{ id, name, slug, location, description, managingPartner, services: string[], mapUrl, images: [first photo] }] }]` — regions in admin order; empty regions omitted |
| `getPublishedYouthSpaceBySlug(slug)` | `{ …space, region: { name }, images: [{ caption, media }] }` or `null` → call `notFound()` |
| `mediaVariantUrl(media, "thumb" \| "medium")` | Sized image URL (cards: `thumb`, detail/lightbox: `medium`); falls back to the original |

Each photo's `media` has `url`, `altText`, `thumbUrl`, `mediumUrl`, `width`, `height`. Admin saves revalidate `/youth-spaces` and `/youth-spaces/<slug>`, so use those routes (or tell Dev B if they change).

Starter spaces are loaded as **drafts**; publish a few in `/admin/youth-spaces` to see data locally.

---

## FE-E6-01 Youth Spaces landing by region

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E6-01 |

**As a** visitor,  
**I want** a Youth Spaces landing page with an introduction and spaces grouped by region,  
**so that** I can find a space near me.

### Acceptance criteria

- [x] `/youth-spaces` has intro copy (Appendix A programme summary) and one section per region.
- [x] Only published spaces appear, grouped under their region; empty regions are not shown. *(helper does this)*
- [x] Regions and spaces follow admin order.
- [x] Optional in-page jump links per region on long pages.

---

## FE-E6-02 Space cards with core fields

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E6-02 |

**As a** visitor,  
**I want** each space to show name, region, location, description, managing partner and services/activities,  
**so that** I know what the space offers and who runs it.

### Acceptance criteria

- [x] Card shows: first photo (`thumb`, with alt text), name, location, short description, managing/coordinating partner, services list.
- [x] Missing optional fields (photo, location, partner, services) are omitted cleanly — no empty labels.
- [x] Card links to the detail page.

---

## FE-E6-03 Space detail page with photos

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E6-03 |

**As a** visitor,  
**I want** a detail page per space with photos,  
**so that** I can learn more about a specific space.

### Acceptance criteria

- [x] Route `/youth-spaces/[slug]` uses `getPublishedYouthSpaceBySlug`. *(seed `getYouthSpaceBySlug` for now; CMS helper swap is follow-up)*
- [x] Up to 5 photos render (`medium`) with alt text and captions when provided.
- [x] Unpublished, archived or unknown spaces 404.
- [x] Page title/description use the space name and description (E15 SEO).

---

## FE-E6-04 Optional map or location link

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | E6-06 |

**As a** visitor,  
**I want** an optional map or location link for a space,  
**so that** I can find it geographically.

### Acceptance criteria

- [x] If `mapUrl` exists, show an "Open in maps" link (admin validates it is `http(s)`).
- [x] External map links open in a new tab with `rel="noopener noreferrer"`.
