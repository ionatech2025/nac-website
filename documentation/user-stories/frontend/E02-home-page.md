# E2 — Home page

## FE-E2-01 Identity, mission and vision

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E2-01 |

**As a** visitor,  
**I want** to see NAC’s name, tagline (“Locally Engaged, Globally Connected”), mission and vision on arrival,  
**so that** I understand who NAC is.

### Acceptance criteria

- [ ] Homepage shows name, tagline, mission and vision.
- [ ] Copy comes from editable content/settings where agreed with Dev B (not permanently hard-coded beyond seed).

---

## FE-E2-02 Hero / slideshow

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E2-02 |
| **Depends on** | Dev B Slideshow Image CMS + published query |

**As a** visitor,  
**I want** a slideshow or hero area driven by admin-managed images,  
**so that** the homepage feels current and visual.

### Acceptance criteria

- [ ] Hero/slideshow renders published slideshow images in admin order.
- [ ] Images support caption/alt and optional destination link.
- [ ] Accessible controls (pause/play or equivalent) if autoplay is used.
- [ ] Images are optimised and do not block LCP badly.

---

## FE-E2-03 Latest stories

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E2-03 |

**As a** visitor,  
**I want** a latest stories section with image, title, excerpt and link,  
**so that** I can quickly see what NAC is publishing.

### Acceptance criteria

- [ ] Shows recent published articles only.
- [ ] Each card has image (if present), title, excerpt and link to the article.
- [ ] Empty state when no stories exist.

---

## FE-E2-04 Latest videos

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E2-04 |

**As a** visitor,  
**I want** a latest videos section with playable embeds,  
**so that** I can watch NAC content without leaving the site.

### Acceptance criteria

- [ ] Published video links render as embeds from allowlisted providers.
- [ ] Title/description shown as agreed with design.
- [ ] No arbitrary embed HTML executed on the client.

---

## FE-E2-05 Youth Go Budget promotion

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E2-05, E14-01 |

**As a** visitor,  
**I want** a clear Youth Go Budget promotion linking to youthgobudgetapp.org,  
**so that** I can reach that separate service.

### Acceptance criteria

- [ ] Promotion is visible on the homepage.
- [ ] Link goes to the configured external URL and opens safely.

---

## FE-E2-06 Featured concepts

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E2-06 |

**As a** visitor,  
**I want** a Featured Concepts section,  
**so that** key themes or programmes are highlighted.

### Acceptance criteria

- [ ] Renders published featured concepts in order.
- [ ] Each item links to its destination URL when set.

---

## FE-E2-07 Partners strip

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E2-07 |

**As a** visitor,  
**I want** to see partner logos (with optional links),  
**so that** I understand who NAC works with.

### Acceptance criteria

- [ ] Published partners shown in admin order.
- [ ] Logos have alt text; links open safely when present.

---

## FE-E2-08 Latest downloads

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E2-08, E11-03 |

**As a** visitor,  
**I want** latest downloads on the homepage,  
**so that** I can get key documents quickly.

### Acceptance criteria

- [ ] Reuses the shared latest-downloads component/block.
- [ ] Only published documents appear.

---

## FE-E2-09 Key figures strip

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E2-09, E3-02 |

**As a** visitor,  
**I want** key figures (for example organisations and youth spaces) on the homepage,  
**so that** NAC’s scale is clear.

### Acceptance criteria

- [ ] Values are read from editable key figures (not hard-coded).
- [ ] Seed defaults may start at 89 organisations / 15 youth spaces pending Q3.

---

## FE-E2-10 Contact and location summary

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E2-10 |

**As a** visitor,  
**I want** a contact and location summary on the homepage,  
**so that** I know how to reach NAC.

### Acceptance criteria

- [ ] Shows address/phone/email summary from site settings.
- [ ] Links through to Contact Us where appropriate.
