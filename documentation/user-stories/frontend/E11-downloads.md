# E11 — Downloads

## FE-E11-01 Document library

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E11-01 |

**As a** visitor,  
**I want** a document library with title, description, category, date, download link and pagination,  
**so that** I can find and download NAC documents.

### Acceptance criteria

- [ ] Lists published documents with metadata and download link.
- [ ] Pagination or bounded list works.
- [ ] Download starts/opens the stored file URL.

---

## FE-E11-02 Filter or group by category

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E11-02 |

**As a** visitor,  
**I want** to filter or group downloads by category,  
**so that** I can narrow the library.

### Acceptance criteria

- [ ] Category filter/group works with the listing.
- [ ] Empty category results show an empty state.

---

## FE-E11-03 Reusable latest downloads block

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E11-03 |

**As a** visitor,  
**I want** the same latest-downloads block on home, footer and programme pages,  
**so that** key files are easy to find everywhere they matter.

### Acceptance criteria

- [ ] Shared component used in home, footer and programme contexts.
- [ ] Only published documents appear.

---

## FE-E11-04 File size and type display

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E11-05 |

**As a** visitor,  
**I want** to see file size and type next to each download,  
**so that** I know what I am downloading (especially on mobile data).

### Acceptance criteria

- [ ] Size and type shown next to each item.
- [ ] PDF / 2.5 MB rule messaging is consistent with upload UX elsewhere (public side only displays; enforcement is Dev B).
