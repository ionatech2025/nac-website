# E3 — About Us

## Server contract (Dev B)

```ts
import { getPublishedAboutPage, listKeyFigures } from "@repo/database";

const about = await getPublishedAboutPage();
// about?.title, mission, vision, whatWeDo, why, updatedAt
// about?.images[] → { id, caption, media } (max 2, admin order)
const figures = await listKeyFigures();
```

Render each section with `<RichText text={…} />`. Empty `why` may be hidden. Images: `mediaVariantUrl(media, "medium")`.

Legacy `getPageContent(ABOUT_PAGE_KEY)` is for other static keys (e.g. privacy), not About Us.

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

- [ ] Page presents founded-2017 narrative and network description from editable content.
- [ ] Improvements-document copy is used once loaded/migrated.
- [ ] Page is reachable from primary navigation.

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

- [ ] Figures are editable values from data (not hard-coded in components).
- [ ] Default seed may show 89 organisations and 15 youth spaces pending confirmation (Q3).

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

- [ ] Renders sanitised rich text (sanitisation owned by Dev B).
- [ ] Headings, links and images display correctly and accessibly.

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

- [ ] Summaries link to corresponding programme detail routes.
- [ ] Only published programmes appear.
