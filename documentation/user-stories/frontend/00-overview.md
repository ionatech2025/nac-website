# Dev A — Frontend (Public UI) Overview

**Owns:** all public pages and components, responsive layout, accessibility, SEO metadata, public form UI, calendar UI, galleries, filters, design system (`packages/ui`).

**Depends on Dev B for:** typed data-access functions, seed data, validated schemas, form submission handlers, published-only content queries.

## Suggested sprint order

| Sprint | Focus | Files |
| --- | --- | --- |
| 0 | Design tokens, layout shell, `(public)` routes | Shared with Dev B |
| 1 | Header, footer, home, About, Staff | E01–E04 |
| 2 | Programmes, Youth Spaces, News | E05–E07 |
| 3 | Opportunities filters, Events calendar & archive | E08–E09 |
| 4 | Galleries, Downloads, Contact, Complaints UI | E10–E13 |
| 5 | SEO, a11y, performance, share links, privacy | E14–E15 |
| 6 | QA fixes, redirects | E15 |

## Story index

| File | Epic | P1 stories (approx.) |
| --- | --- | --- |
| [E01-global-layout-and-navigation.md](E01-global-layout-and-navigation.md) | Global layout | Header, mobile nav, footer, 404, states |
| [E02-home-page.md](E02-home-page.md) | Home | Hero, stories, videos, promotions, downloads |
| [E03-about-us.md](E03-about-us.md) | About Us | Editable about, key figures, rich text |
| [E04-staff-directory.md](E04-staff-directory.md) | Staff | Staff list with photos |
| [E05-programmes.md](E05-programmes.md) | Programmes | Listing, detail, GAP/YCR links |
| [E06-youth-spaces.md](E06-youth-spaces.md) | Youth Spaces | Regions, space cards/pages |
| [E07-blogs-and-news.md](E07-blogs-and-news.md) | Blogs & News | Listing, detail, share |
| [E08-opportunities.md](E08-opportunities.md) | Opportunities | List, filters, mailto apply |
| [E09-events.md](E09-events.md) | Events | Calendar views, archive, registration link |
| [E10-galleries.md](E10-galleries.md) | Galleries | Photo albums, video embeds |
| [E11-downloads.md](E11-downloads.md) | Downloads | Library, latest block, size display |
| [E12-contact-and-inquiries.md](E12-contact-and-inquiries.md) | Contact | Contact details + form UI |
| [E13-complaints.md](E13-complaints.md) | Complaints | Anonymous complaint form UI |
| [E14-external-links-and-social.md](E14-external-links-and-social.md) | External & social | Footer links, share buttons |
| [E15-seo-performance-accessibility.md](E15-seo-performance-accessibility.md) | Cross-cutting | SEO, CWV, WCAG 2.2 AA |

## Acceptance (frontend)

All pages and navigation exist; pages work on agreed screen sizes; forms validate and give feedback; filters and calendar views work; accessibility and SEO checks pass.
