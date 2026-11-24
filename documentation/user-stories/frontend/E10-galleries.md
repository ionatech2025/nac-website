# E10 — Galleries

## FE-E10-01 Photo gallery with albums and lightbox

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E10-01 |

**As a** visitor,  
**I want** photo albums in a responsive grid with a lightbox,  
**so that** I can browse NAC photos comfortably.

### Acceptance criteria

- [x] Albums list and album detail (grid of images) exist. *(seed until CMS)*
- [x] Lightbox opens an image with next/prev where applicable.
- [x] Layout works on mobile and desktop.

---

## FE-E10-02 Captions and alt text

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E10-02 |

**As a** visitor (including assistive tech users),  
**I want** captions and alt text on images,  
**so that** photos are understandable without relying on vision alone.

### Acceptance criteria

- [x] Captions display when provided.
- [x] Alt text is present on images (fallback if missing is sensible and not decorative spam).

---

## FE-E10-03 Video gallery embeds

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E10-03, E10-04 |

**As a** visitor,  
**I want** a video gallery with title, description and embedded playback from allowlisted providers,  
**so that** I can watch NAC videos on the site.

### Acceptance criteria

- [x] Videos render from stored provider URL/reference (not arbitrary embed code).
- [x] Title and description shown.
- [x] Unsupported providers fail gracefully.
