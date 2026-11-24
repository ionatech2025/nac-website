# E15 — SEO, performance and accessibility

## FE-E15-01 Page metadata

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E15-01 |

**As a** visitor discovering NAC via search or social,  
**I want** every public page to have a unique title, meta description, canonical URL and sharing metadata,  
**so that** pages share and rank cleanly.

### Acceptance criteria

- [x] Every public route sets title, description, canonical and OG/Twitter metadata.
- [x] Fallbacks exist when content-specific SEO fields are empty.

---

## FE-E15-02 Sitemap and robots

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E15-02 |

**As a** search engine,  
**I want** an XML sitemap and robots rules that exclude admin and complaint-submission routes,  
**so that** private/sensitive paths are not indexed.

### Acceptance criteria

- [x] Sitemap lists public content URLs.
- [x] Robots/sitemap exclude `/admin` and complaint submission endpoints/pages as agreed with Dev B.

---

## FE-E15-03 Legacy redirects

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E15-03 |

**As a** visitor following an old nacuganda.org link,  
**I want** redirects when paths change,  
**so that** bookmarks and partner links keep working.

### Acceptance criteria

- [x] Redirect map covers changed legacy paths (coordinate with migration).
- [x] Redirects are permanent where content moved permanently.

---

## FE-E15-04 Image performance

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E15-04 |

**As a** visitor on mobile data,  
**I want** optimised, resized images and lazy loading with minimal unnecessary client JS,  
**so that** pages load quickly.

### Acceptance criteria

- [x] Next.js image optimisation (or equivalent) used for content images.
- [x] Below-the-fold images lazy-load.
- [x] Prefer Server Components; avoid heavy client bundles for static content.

---

## FE-E15-05 WCAG 2.2 AA target

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E15-05, NFR-04 |

**As a** visitor using assistive technology or keyboard only,  
**I want** the public site to meet WCAG 2.2 AA targets,  
**so that** I can use NAC’s content independently.

### Acceptance criteria

- [x] Semantic landmarks, keyboard operation, visible focus.
- [x] Labelled forms, meaningful alt text, sufficient colour contrast.
- [x] Respect `prefers-reduced-motion` for non-essential animation.

---

## FE-E15-06 Cross-browser support

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E15-06 |

**As a** visitor,  
**I want** the site to work in current Chrome, Edge, Firefox, Safari and common Android/iOS browsers,  
**so that** device choice does not block access.

### Acceptance criteria

- [x] Smoke-tested on agreed desktop and mobile browsers.
- [x] No critical layout/function breakers on mobile-first layouts.

---

## FE-E15-07 Privacy notice page

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E15-07 |

**As a** visitor,  
**I want** a privacy notice describing visitor statistics and how complaints are handled,  
**so that** I understand what data is collected.

### Acceptance criteria

- [x] Privacy page is linked from the footer.
- [x] Copy covers first-party analytics (no cookies / no raw IP) and anonymous complaints.
- [x] Content editable or migratable with Dev B as agreed.
