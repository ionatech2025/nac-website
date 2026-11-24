# E14 — External links and social media

## FE-E14-01 External service links from settings

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E14-01 |

**As a** visitor,  
**I want** links to youthgobudgetapp.org and slogbaa.org from editable site settings,  
**so that** those services stay reachable if URLs change.

### Acceptance criteria

- [x] Links render from site settings in footer/home/programme contexts as designed. *(ready — see server contract below)*
- [x] Marked external and open safely.

> **Server contract (ready, AD-B6-01):**
> - `const { external, social, contact } = await getPublicSiteSettings()` from `@repo/database`.
> - External: `external.youthGoBudget`, `external.slogbaa` (seeded to the known `.org` URLs; empty = hide).
> - Social: `social.facebook` / `x` / `instagram` / `youtube` / `linkedin` / `tiktok` — only render icons for non-empty URLs; open with `rel="noopener noreferrer" target="_blank"`.
> - WhatsApp buttons (FE-E14-04): use `contact.whatsapp` (digits or `wa.me` URL).

---

## FE-E14-02 Social profile links in footer

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E14-02 |

**As a** visitor,  
**I want** social media profile links in the footer,  
**so that** I can follow NAC on its platforms.

### Acceptance criteria

- [x] Profile URLs come from site settings.
- [x] Icons/labels are accessible.

---

## FE-E14-03 Share buttons on content

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E14-03 |

**As a** visitor,  
**I want** share buttons on articles, events and opportunities,  
**so that** I can share NAC content.

### Acceptance criteria

- [x] Share controls appear on article, event and opportunity detail pages.
- [x] Share uses the page’s canonical URL.

---

## FE-E14-04 WhatsApp action buttons

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E14-04 |
| **Status** | Ready — Q8 decided (WhatsApp buttons, not feeds)

**As a** visitor,  
**I want** WhatsApp buttons to share or contact (not embedded feeds),  
**so that** I can reach NAC on the channel people already use.

### Acceptance criteria

- [x] WhatsApp share and/or contact buttons appear where designed (e.g. content share, footer/contact).
- [x] Target number/link comes from site settings when applicable.
- [x] No embedded social feed widgets in v1.

---

## FE-E14-05 Embedded social feeds — deferred

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | E14-05 |
| **Status** | Deferred — may come later |

Do not implement embedded feeds in v1.
