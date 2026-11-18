# E1 — Global layout and navigation

## FE-E1-01 Consistent header and primary navigation

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E1-01 |
| **Depends on** | Site branding assets; nav structure from IA §5.1 |

**As a** visitor,  
**I want** a consistent header with NAC branding and primary navigation (including grouped Programs, Galleries and Contact menus),  
**so that** I can reach any main section from every page.

### Acceptance criteria

- [x] Header shows correct NAC logo/branding on all public pages.
- [x] Primary nav includes: Home, About Us, Our Staff, Programs, Youth Spaces, Opportunities, Events, Galleries, Blogs & News, Downloads, Contact Us.
- [x] Programs, Galleries and Contact are grouped menus as specified.
- [x] Active section is indicated visually.
- [x] Works with keyboard and screen readers (landmarks, focus order).

---

## FE-E1-02 Mobile navigation

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E1-02 |

**As a** visitor on a phone,  
**I want** a usable mobile menu,  
**so that** I can find information easily at any viewport size.

### Acceptance criteria

- [x] Navigation is usable from small phones through desktop.
- [x] Menu open/close is keyboard accessible and announces state.
- [x] Focus is trapped or managed correctly while the menu is open.
- [x] No content is unreachable behind the menu overlay.

---

## FE-E1-03 Site footer

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E1-03 |
| **Depends on** | Dev B site settings + latest downloads data access |

**As a** visitor,  
**I want** a footer with contact details, social links, latest downloads and copyright,  
**so that** I can reach NAC and useful resources without leaving the current section.

### Acceptance criteria

- [x] Footer reads contact, social, external links and copyright from site settings (not hard-coded).
- [ ] Latest downloads come from the public data-access layer.
- [x] Links to Youth Go Budget and SLOGBAA appear and open safely.
- [x] Footer is consistent across public pages.

---

## FE-E1-04 Custom 404 and error pages

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E1-04 |

**As a** visitor,  
**I want** a helpful page when a link is broken or something fails,  
**so that** I can get back to useful content.

### Acceptance criteria

- [x] Custom not-found (404) page with navigation back to home/key sections.
- [x] Custom error page for unexpected failures.
- [x] Both pages keep site branding and do not expose stack traces.

---

## FE-E1-05 Loading, empty and error states

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E1-05 |

**As a** visitor,  
**I want** clear loading, empty and error states on content pages,  
**so that** I understand what is happening when content is missing or slow.

### Acceptance criteria

- [x] Every content-driven page has loading, empty and error UI.
- [x] Empty states explain that there is no content yet (not a broken page).
- [x] Errors offer a recovery path (retry or go home) where practical.

---

## FE-E1-06 External link treatment

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E1-06 |

**As a** visitor,  
**I want** external links (Youth Go Budget, SLOGBAA, registration links) clearly marked and opened safely,  
**so that** I know I am leaving nacuganda.org.

### Acceptance criteria

- [x] External links are visually marked.
- [x] They use `rel="noopener"` (and appropriate `target` behaviour).
- [x] Registration and partner external URLs follow the same pattern.
