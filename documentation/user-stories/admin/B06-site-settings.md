# B6 — Site settings (configuration)

## AD-B6-01 Contact and social settings

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B6-01, B6-02 |

**As the** Site Admin,  
**I want** to edit addresses, phones, toll-free number, email, social profile links and external service links,  
**so that** the public site stays accurate without code changes.

### Acceptance criteria

- [x] Editable: physical/postal address, phones, toll-free, email. *(`/admin/settings` → Contact details; also WhatsApp for E14-04 buttons)*
- [x] Editable: social profile URLs, youthgobudgetapp.org and slogbaa.org links. *(`social` + `external` SiteSetting rows; Facebook, X, Instagram, YouTube, LinkedIn, TikTok — blank = hidden)*
- [x] Public footer/contact pages read these values. *(`getPublicSiteSettings()` in `@repo/database`; returns typed `{ contact, social, external }` with empty-string fallbacks)*

### Implementation notes

- Three `SiteSetting` keys hold JSON: `contact`, `social`, `external`. Seeded idempotently by `ensureSiteSettings()` / `db:seed`.
- Each section of the admin page saves on its own (three server actions) so a bad social URL doesn't block saving the address.
- Optional links must be empty or `http(s)://…`. Email is optional but validated when set.
- Revalidates `/` layout and `/contact` on save so Dev A's footer picks up changes.

---

## AD-B6-02 Homepage layout and taxonomies (NOT NOW)

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B6-03, B6-04 |
| **Note** | Opportunity types / document categories starting list is open (Q11) — ship editable lists with sensible seeds.

**As the** Site Admin,  
**I want** to control homepage section visibility/order and maintain opportunity types and document categories,  
**so that** structure can evolve without deploys.

### Acceptance criteria

- [ ] Homepage section order/visibility configurable (P2).
- [ ] Opportunity types and document categories editable.
- [ ] Seed `OpportunityType` with at least **Volunteer** (Q11); expand categories when NAC supplies the full list.

---

## AD-B6-03 Navigation menu editing — out of scope for v1

| | |
| --- | --- |
| **Priority** | — |
| **Requirements** | B6-05 |
| **Status** | **Out of scope** — Q6: Dashboard + Content only |

Do not build free-form Structure/nav editing, Configuration extras, Comments, or separate Reports. Primary nav stays code/IA-driven for v1.
