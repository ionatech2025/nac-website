# E7 — Blogs and News

## FE-E7-01 Article listing

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E7-01 |

**As a** visitor,  
**I want** an article listing with image, title, excerpt, read-more link and pagination,  
**so that** I can browse NAC news efficiently.

### Acceptance criteria

- [ ] Lists published articles only, newest first (or agreed sort).
- [ ] Cards show image, title, excerpt and link.
- [ ] Pagination or bounded list works.

---

## FE-E7-02 Article detail

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E7-02, E7-05 |

**As a** visitor,  
**I want** an article detail page with title, body, image, author (if supplied) and published date,  
**so that** I can read the full story.

### Acceptance criteria

- [ ] Detail shows title, sanitised body, cover image, optional author, published date.
- [ ] Draft/archived articles are not reachable publicly.
- [ ] Unknown slug returns 404.

---

## FE-E7-03 Share links on articles

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E7-03, E14-03 |

**As a** visitor,  
**I want** share links to social media on each article,  
**so that** I can pass the story on.

### Acceptance criteria

- [ ] Share actions for agreed platforms appear on the article page.
- [ ] Share URLs encode the canonical article URL.

---

## FE-E7-04 Per-article SEO fields

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E7-04, E15-01 |

**As a** visitor (and as search engines),  
**I want** each article to have a unique title, description, slug and sharing image,  
**so that** articles are discoverable and share cleanly.

### Acceptance criteria

- [ ] Page metadata uses article SEO fields when set, with sensible fallbacks.
- [ ] Open Graph / Twitter card image uses the sharing image when present.
