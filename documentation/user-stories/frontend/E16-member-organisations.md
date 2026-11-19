# E16 — Member organisations

NAC is a network of member organisations. This epic is the public listing and detail pages. Homepage **Partners** (logos only) remain a separate content type (`listPublishedPartners`).

## Server contract (Dev B)

```ts
import {
  listPublishedMemberOrganisations,
  getPublishedMemberOrganisationBySlug,
  mediaVariantUrl,
} from "@repo/database";

const list = await listPublishedMemberOrganisations();
// each: name, slug, bio, websiteUrl | null, images[0]? (cover)

const detail = await getPublishedMemberOrganisationBySlug(slug);
// detail?.bio, websiteUrl, images[] (max 3, admin order) — null → 404
```

- Bio: `<RichText text={…} />`.
- Images: `mediaVariantUrl(media, "thumb" | "medium")`.
- Website: only render when `websiteUrl` is non-empty; use `target="_blank"` and `rel="noopener noreferrer"`.
- Drafts never appear — helpers return PUBLISHED only.

Suggested routes: `/member-organisations` and `/member-organisations/[slug]`.

---

## FE-E16-01 Member organisations listing

| | |
| --- | --- |
| **Priority** | P1 |
| **Depends on** | `listPublishedMemberOrganisations` |

**As a** visitor,  
**I want** a Member organisations page listing NAC network members,  
**so that** I can see who belongs to the network.

### Acceptance criteria

- [ ] Page reachable from primary navigation (or About / agreed IA link labelled “Member organisations”).
- [ ] Shows published organisations in admin sort order.
- [ ] Each card shows name, short bio excerpt (or full bio if short), and first image when present.
- [ ] Empty state when none are published.
- [ ] Cards link to the organisation detail page.

---

## FE-E16-02 Organisation detail page

| | |
| --- | --- |
| **Priority** | P1 |
| **Depends on** | `getPublishedMemberOrganisationBySlug` |

**As a** visitor,  
**I want** a page for each member organisation with bio, photos and website link,  
**so that** I can learn about that organisation.

### Acceptance criteria

- [ ] Shows name, short bio (`<RichText>`), up to 3 images in admin order.
- [ ] Website link appears only when supplied; opens in a new tab safely.
- [ ] Unknown or unpublished slug returns 404.
- [ ] Readable on mobile; images have alt text from media.
