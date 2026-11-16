# E6 — Youth Spaces

> New public section. Spaces grouped by region: Kampala, West Nile, Western Uganda, Eastern Uganda. Seed content in requirements Appendix A (confirm Q3 before treating counts as final).

## FE-E6-01 Youth Spaces landing by region

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E6-01 |

**As a** visitor,  
**I want** a Youth Spaces landing page with an introduction and spaces grouped by region,  
**so that** I can find a space near me.

### Acceptance criteria

- [ ] Landing page has intro copy and regions as groupings.
- [ ] Only published spaces appear, grouped under their region.
- [ ] Regions follow admin order.

---

## FE-E6-02 Space cards with core fields

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E6-02 |

**As a** visitor,  
**I want** each space to show name, region, location, description, managing partner and services/activities,  
**so that** I know what the space offers and who runs it.

### Acceptance criteria

- [ ] Card/summary shows: name, region, area/location, short description, managing/coordinating partner, services list.
- [ ] Missing optional fields are omitted cleanly.

---

## FE-E6-03 Space detail page with photos

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | E6-03 |

**As a** visitor,  
**I want** an optional detail page per space with photos,  
**so that** I can learn more about a specific space.

### Acceptance criteria

- [ ] Detail route exists for a space slug.
- [ ] Photos render with alt text when provided.
- [ ] Unpublished spaces 404.

---

## FE-E6-04 Optional map or location link

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | E6-06 |

**As a** visitor,  
**I want** an optional map or location link for a space,  
**so that** I can find it geographically.

### Acceptance criteria

- [ ] If a location URL/coords exist, show a map or external map link.
- [ ] External map links open safely.
