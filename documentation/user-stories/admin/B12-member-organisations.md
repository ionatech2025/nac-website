# B12 — Member organisations (admin)

Admin CMS for NAC network member organisations. Distinct from homepage **Partners** (logo strip). Public UI is [E16](../frontend/E16-member-organisations.md).

## AD-B12-01 CRUD and publish

| | |
| --- | --- |
| **Priority** | P1 |
| **Status** | Done |

**As a** site admin,  
**I want** to create, edit, publish, unpublish and archive member organisations,  
**so that** the public Member organisations pages stay accurate.

### Acceptance criteria

- [x] Admin list at `/admin/member-organisations` with search and status filter.
- [x] Fields: name, slug, short bio (rich-text conventions), optional website URL, sort order.
- [x] Draft → publish / unpublish / archive via status actions.
- [x] Public helpers only return `PUBLISHED` rows.

---

## AD-B12-02 Photos (max 3)

| | |
| --- | --- |
| **Priority** | P1 |
| **Status** | Done |

**As a** site admin,  
**I want** to attach up to three photos per organisation with caption and alt text,  
**so that** the public detail page can show a small gallery.

### Acceptance criteria

- [x] Upload / caption / alt / reorder / remove on the edit page.
- [x] Fourth upload rejected with a clear message.
- [x] First by sort order is the listing card cover.
- [x] Removed media cleaned via `deleteMediaIfUnused` when unused.

---

## AD-B12-03 Public data contract

| | |
| --- | --- |
| **Priority** | P1 |
| **Status** | Done |

**As** Dev A,  
**I want** typed helpers for listing and detail,  
**so that** I never query Prisma from public pages.

### Delivered

- `listPublishedMemberOrganisations(limit?)`
- `getPublishedMemberOrganisationBySlug(slug)`
- Documented in `frontend/E16-member-organisations.md` and `frontend/00-overview.md`
