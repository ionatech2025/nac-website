# Dev B — Admin portal & server Overview

**Owns:** admin portal UI and logic, authentication, database schema and migrations, server actions / route handlers, file uploads, visitor analytics, inquiry and complaint handling, seed and migration scripts, typed data-access for public pages.

**Delivers to Dev A:** typed data-access functions and validated schemas for every public page; seed data so frontend can proceed in parallel.

## Suggested sprint order

| Sprint | Focus                                                                            | Files              |
| ------ | -------------------------------------------------------------------------------- | ------------------ |
| 0      | Schema, seed, auth skeleton, CI, shared validation (**do this before Sprint 1**) | B01, B09 (partial) |
| 1      | Login polish, dashboard shell, Team Member, Programme, About/Key Figures, Site Settings | B01–B03, B06 |

**Current start:** AD-B6-01 site contact/social settings landed. Next: AD-B4-04 inquiry email, AD-B2-01, or B10 migration.
| 2      | Article, Youth Space, Download, uploads (2.5 MB)                                 | B03, B07           |
| 3      | Opportunity & Event admin, derived status, public data access                    | B03, B09           |
| 4      | Albums, videos, inquiry & complaint inboxes, anonymity                           | B03–B05            |
| 5      | Visitor analytics & dashboard stats, backups                                     | B02, B08, B09      |
| 6      | Migration scripts, security review, handover                                     | B10                |

## Story index

| File | Epic |
| --- | --- |
| [B01-authentication.md](B01-authentication.md) | Single admin auth |
| [B02-admin-dashboard.md](B02-admin-dashboard.md) | Dashboard & attention list |
| [B03-content-management.md](B03-content-management.md) | One page per content type |
| [B04-inquiry-inbox.md](B04-inquiry-inbox.md) | Contact form inbox |
| [B05-complaints-inbox.md](B05-complaints-inbox.md) | Anonymous complaints inbox |
| [B06-site-settings.md](B06-site-settings.md) | Site configuration |
| [B07-media-and-uploads.md](B07-media-and-uploads.md) | PDFs & images |
| [B08-visitor-analytics.md](B08-visitor-analytics.md) | Collection & roll-ups |
| [B09-data-access-and-security.md](B09-data-access-and-security.md) | Public reads, security, backups |
| [B10-content-migration.md](B10-content-migration.md) | Full content migration scripts |
| [B11-youth-spaces.md](B11-youth-spaces.md) | Youth spaces & regions (admin side of E6) |

## Acceptance (back office)

Site Admin can manage every content type from its own page; dashboard shows visitor statistics; inquiries and complaints reach the admin; uploads enforce limits; access control is enforced on the server; backups have been tested.
