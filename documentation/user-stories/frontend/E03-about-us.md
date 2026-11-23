# E3 — About Us

## Server contract (Dev B)

When CMS reads are wired, swap seed helpers in `apps/web/lib/about-data.ts` for:

```ts
import { getPublishedAboutPage, listKeyFigures, listPublishedProgrammes } from "@repo/database";
```

**Dev A (this epic):** public About UI uses seed/fallback data only — no Prisma / `DATABASE_URL` from the frontend workstream.

Render each section with `<RichText text={…} />`. Empty `why` may be hidden.

---

## FE-E3-01 About Us page

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E3-01 |
| **Depends on** | Dev B About content API |

**As a** visitor,  
**I want** an About Us page with the improved organisational copy,  
**so that** I understand NAC’s history and purpose.

### Acceptance criteria

- [x] Page presents founded-2017 narrative and network description from editable content.
- [x] Improvements-document copy is used once loaded/migrated.
- [x] Page is reachable from primary navigation.

---

## FE-E3-02 Key figures block

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E3-02 |

**As a** visitor,  
**I want** to see key figures such as organisations in the network and youth spaces,  
**so that** NAC’s reach is concrete.

### Acceptance criteria

- [x] Figures are editable values from data (not hard-coded in components).
- [x] Default seed may show 89 organisations and 15 youth spaces pending confirmation (Q3).

---

## FE-E3-03 Rich text and media on About

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E3-03 |

**As a** visitor,  
**I want** formatted text, headings, links and images on About Us,  
**so that** the page is readable and visual.

### Acceptance criteria

- [x] Renders sanitised rich text (sanitisation owned by Dev B).
- [x] Headings, links and images display correctly and accessibly.

---

## FE-E3-04 Programme summaries linking out

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E3-04 |

**As a** visitor,  
**I want** programme summaries on About that link to each programme page,  
**so that** I can dig into a programme from the organisation overview.

### Acceptance criteria

- [x] Summaries link to corresponding programme detail routes.
- [x] Only published programmes appear.
