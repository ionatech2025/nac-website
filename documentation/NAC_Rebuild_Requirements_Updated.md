# Network for Active Citizens (NAC) Website Rebuild

## Requirements Specification v3 — Baseline for User Story Generation

**Project:** Rebuild of [nacuganda.org](https://nacuganda.org/)
**Delivered by:** iONA Tech (technical delivery) for NAC (content owner)
**Stack:** TypeScript, Next.js (full stack), an ORM (Prisma recommended; Drizzle acceptable), PostgreSQL
**Hosting:** Vercel, free (Hobby) plan; existing domain
**Team:** two developers — Dev A (frontend / public UI) and Dev B (back office / admin portal and server side)
**Supersedes:** *NAC_Rebuild_Requirements_Updated.md* (draft v2), after stakeholder answers to Section 12 and the content improvements in *NAC_Website_improvements.pdf*
**Status:** Ready for story breakdown; open items listed in Section 15

---

## 0. How to use this document to generate user stories

1. Each **epic** (E = public site, B = back office) groups related requirements.
2. Each **requirement ID** (for example `E8-04`) maps to one or more user stories. Split a requirement if it cannot be built and tested in one sprint.
3. **Story seeds** under each epic give the "As a … I want … so that …" starting point. Expand them using the requirements and acceptance notes.
4. Columns used in requirement tables:
   - **Dev:** `A` = frontend, `B` = back office / server, `A+B` = both (agree the contract first, see Section 3).
   - **P:** `P1` essential for launch, `P2` important, `P3` optional or after launch.
   - **Src:** `[Confirmed]` answered by the stakeholder, `[Observed]` seen on the existing site, `[New]` from the improvements PDF, `[Proposed]` recommended by the delivery team, `[Open]` still needs a decision.
5. Anything marked `[Open]` should be written as a story only after the decision is made (Section 15.1).

**Actors**

| Actor | Description |
|---|---|
| Visitor | Anyone browsing the public site. No account. |
| Applicant | A visitor interested in an opportunity. Applies **by email, outside the site**. |
| Complainant | A visitor submitting a complaint. **Must remain anonymous.** |
| Site Admin | The single NAC administrator who manages all content and reviews inquiries and complaints in the admin portal. |
| iONA Technical Team | Builds, hosts and maintains the system technically. Does not manage content. |

---

## 1. Purpose and objectives

The rebuilt website shall:

1. Present NAC's identity, mission, vision, programmes, youth spaces, people, partners and publications.
2. Make stories, opportunities, events, photos, videos and downloads easy to find.
3. Provide a contact form and an anonymous complaints form.
4. Let the Site Admin maintain all content from an admin portal, without code changes.
5. Show the Site Admin a dashboard with visitor statistics and activity summaries.
6. Be responsive, accessible, fast, secure and search-engine friendly.
7. Link to Youth Go Budget ([youthgobudgetapp.org](https://youthgobudgetapp.org)) and SLOGBAA ([slogbaa.org](https://slogbaa.org)) as separate, externally run services.

---

## 2. Confirmed stakeholder decisions

These replace the earlier open questions and are the basis for scope.

| # | Topic | Decision | Effect on requirements |
|---|---|---|---|
| 12.1.1 | Who manages the site after launch | The admin | Single actor for all content tasks |
| 12.1.2 | Number of admin accounts | One | One admin account. No multi-role model in v1 (keep a `role` field so roles can be added later) |
| 12.1.3 | Publishing approval | Admin publishes directly | No approval workflow |
| 12.1.4 | Admin interface | A general dashboard, plus a separate page for each content type | See Epic B2 and B3 |
| 12.1.5 | Revision history | No | Not required. Do not build restore or version history |
| 12.2.6 | Applying for opportunities | By email, externally. Contact info shown on each opportunity | No application form or applicant accounts |
| 12.2.7 | Auto-close on deadline | Yes | Opportunity status is derived from closing date |
| 12.2.8 | Filter opportunities | Yes | Filters by status, type, closing date |
| 12.3.9 | Calendar actively maintained | Yes | Full calendar is in scope |
| 12.3.10 | Event registration | Registration links for now | Store a registration URL. No registration form |
| 12.3.11 | Past events archive | Yes | Past events remain browsable |
| 12.4.12 | Inquiries page | A contact form | Contact form in scope |
| 12.4.13 | Complaints process | Visitor completes a complaint form. Admin sees it and details such as date in the admin portal | Complaint form plus admin complaints inbox |
| 12.4.14 | Anonymous complaints | Yes | No identity fields. See Epic E13 |
| 12.4.15 | Who reviews complaints | The admin | Only the Site Admin can see complaints |
| 12.4.16 | Confidentiality | Keep the complaint source anonymous | No tracking or identifying data stored with complaints |
| 12.5.17 | Brand assets from NAC | Yes | NAC supplies logos, photos, partner logos, brand guidelines |
| 12.5.18 | Migrate existing content | Yes, all of it | Full migration in scope (Section 12) |
| 12.5.19 | External URLs | youthgobudgetapp.org and slogbaa.org | Used as external links |
| 12.5.20 | Social media | Yes | Share links on content, social profile links in footer. Feeds: see E14 |
| 12.5.21 | Other pages or services not public | Yes, especially in the admin portal | More discovery of the existing admin portal needed (Section 15.1) |
| 12.6.22 | Hosting and domain | Vercel free (Hobby) plan. Existing domain | See Section 4 for platform limits |
| 12.6.23 | Account ownership | NAC owns hosting, database, storage and backup accounts. iONA manages them | NAC-owned accounts, iONA administers |
| 12.6.24 | Data residency, privacy, security requirements | Yes, they exist | Details to be supplied by NAC. Assume Uganda Data Protection and Privacy Act, 2019 as baseline |
| 12.6.25 | Ongoing support | iONA does technical support. Content updates by the Site Admin in the portal | No content-editing work for iONA after handover |

**Additional technical decisions from the project team**

- Next.js full stack with an ORM and PostgreSQL.
- **Uploaded PDF documents and images must not exceed 2.5 MB each.**
- Two developers: one on the frontend UI, one on the back office.
- The admin dashboard must show a **visitor count**, plus other basic visitor information (Section 9).

---

## 3. Team workstreams and contract

| | Dev A — Frontend (public UI) | Dev B — Back office |
|---|---|---|
| Owns | All public pages and components, responsive layout, accessibility, SEO metadata, public forms (UI), calendar UI, galleries, filters, design system | Admin portal (UI and logic), authentication, database schema and migrations, server actions / route handlers, file uploads, visitor analytics, inquiry and complaint handling, seed and migration scripts |
| Epics | E1 to E14 (presentation and client behaviour) | B1 to B9, plus the server side of E8, E9, E12, E13 |
| Delivers to the other | Components for content preview in admin (article body renderer, gallery, calendar) | Typed data-access functions and validated schemas for every public page |

**Working agreements**

1. **Database schema is owned by Dev B.** Dev A requests changes by pull request.
2. **Sprint 0 (shared):** repo, Next.js app with `(public)` and `(admin)` route groups, ORM schema for core entities, seed data, shared validation schemas, CI. After this, both developers work in parallel.
3. Dev A builds against **seed data and the typed data-access layer**, so public pages do not wait for the admin portal.
4. The server is authoritative for validation and authorisation. The client repeats validation only for user feedback.
5. Public forms (contact, complaint) are built jointly: Dev A builds the form UI, Dev B builds the handler and storage.

---

## 4. Technology and hosting constraints

### 4.1 Stack

- Next.js (App Router), TypeScript strict mode, React. Server Components by default.
- PostgreSQL with an ORM (Prisma recommended). Migrations are version controlled.
- Zod (or equivalent) for shared validation.
- Authentication for the single admin account (for example Auth.js credentials, or an equivalent secure session solution).
- Tailwind CSS and CSS Modules as the styling system.
- Suggested structure (single deployable app inside a light monorepo):

```text
nac-platform/
├── apps/web/src/app/
│   ├── (public)/          # Dev A
│   ├── admin/             # Dev B
│   └── api/               # Dev B
├── packages/database/     # schema, migrations, data-access (Dev B)
├── packages/validation/   # shared Zod schemas
├── packages/ui/           # shared components (Dev A)
└── docs/
```

### 4.2 Vercel Hobby constraints that shape the design

The Vercel documentation checked on 16 November 2026 shows the following. Confirm again at build time because limits change.

| Constraint (Hobby) | Consequence for this project |
|---|---|
| Function request and response bodies are limited to 4.5 MB | The **2.5 MB file cap** fits comfortably under the 4.5 MB body limit. Enforce 2.5 MB on client and server for PDFs and images. For a safer path, upload directly to storage from the browser (signed or client upload) |
| Cron jobs run at most once per day | Do **not** rely on a scheduler to close opportunities. Derive open/closed from the closing date when reading data. Use the daily cron only for analytics roll-ups and cleanup |
| Function duration is capped on Hobby (the cap has changed over time, so check the current figure) | Keep admin operations and migrations light. Run bulk migration as local scripts, not as web requests |
| Hobby is for **personal, non-commercial use**, with one team member | **Compliance risk** for an organisation website. See Section 15.2 (R1) |
| Private repositories owned by a GitHub organisation need Pro | Repo ownership and the two-developer workflow must be settled (Section 15.2, R2) |
| No built-in PostgreSQL or large file storage on the free tier | Use a separate free-tier managed PostgreSQL and object storage, in **NAC-owned accounts** managed by iONA |
| Short log retention | Do not depend on platform logs for audit or support. Add minimal application error logging, but **never log complaint content** |

### 4.3 Accounts and ownership

- NAC owns the database, storage, domain and backup accounts. iONA administers them.
- Domain: the existing NAC domain (nacuganda.org) is kept. DNS changes are made by whoever controls DNS (confirm).
- Secrets are stored as environment variables, never in the repository.

---

## 5. Information architecture

### 5.1 Public navigation

| Item | Destination |
|---|---|
| Home | Homepage |
| About Us | Organisation profile and key figures |
| Our Staff | Staff directory |
| Programs | GAP, YCR, Community Journalism, Youth Organizing and Strengthening (see 5.2) |
| Youth Spaces | Youth spaces by region **[New]** |
| Opportunities | Opportunities list with filters |
| Events | Events calendar and past events |
| Galleries | Photo Gallery, Video Gallery |
| Blogs & News | Article listing |
| Downloads | Document library |
| Contact Us | Inquiries (contact form), Complaints |

Footer: contact details, social links, latest downloads, links to Youth Go Budget and SLOGBAA, copyright.

### 5.2 Programme names, and a conflict to resolve

The improvements PDF describes **four** programme areas: *Governance and Participation (GAP)*, *Youth Climate Resilience (YCR)*, *Community Journalism*, and *Youth Spaces: Youth Organizing and Strengthening*. The earlier spec listed **five**: GAAP, Youth CSO Village, Youth Climate Resilience, Communication for Development (C4D), and Youth Organizing and Strengthening. `[Open]` NAC to confirm which list is final and what happens to *Youth CSO Village* and *C4D* (see 15.1, Q1).

Programme pages must be admin-managed, so the final list can change without code changes.

---

## 6. Public website requirements (Dev A, with Dev B data support)

### E1 — Global layout and navigation

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E1-01 | Consistent header with NAC branding and primary navigation, including grouped Programs, Galleries and Contact menus | A | P1 | [Observed] |
| E1-02 | Mobile navigation pattern, usable at all viewport sizes | A | P1 | [Proposed] |
| E1-03 | Reusable footer with contact details, social links, latest downloads and copyright, all read from site settings | A+B | P1 | [Observed] |
| E1-04 | Custom not-found (404) and error pages | A | P1 | [Proposed] |
| E1-05 | Loading, empty and error states on every content-driven page | A | P1 | [Proposed] |
| E1-06 | External links (Youth Go Budget, SLOGBAA, registration links) are visually marked and open safely (`rel="noopener"`) | A | P2 | [Proposed] |

Story seeds: *As a visitor on a phone, I can open the menu and reach any section so that I can find information easily.* *As a visitor, I see a helpful page when a link is broken.*

### E2 — Home page

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E2-01 | Show NAC name, tagline ("Locally Engaged, Globally Connected") , mission and vision | A | P1 | [Observed] |
| E2-02 | Slideshow or hero area driven by admin-managed Slideshow Images | A+B | P1 | [Observed] |
| E2-03 | Latest stories section (image, title, excerpt, link) | A+B | P1 | [Observed] |
| E2-04 | Latest videos section with playable embeds | A+B | P1 | [Observed] |
| E2-05 | Youth Go Budget promotion with external link to youthgobudgetapp.org | A | P1 | [Confirmed] |
| E2-06 | Featured Concepts section, driven by admin-managed Featured Concepts | A+B | P2 | [Observed] |
| E2-07 | Partners section with logos and optional links | A+B | P2 | [Observed] |
| E2-08 | Latest downloads section | A+B | P1 | [Observed] |
| E2-09 | Key figures strip (for example organisations in the network, youth spaces), editable by admin | A+B | P2 | [New] |
| E2-10 | Contact and location summary | A | P1 | [Observed] |

Story seeds: *As a visitor, I see NAC's mission and latest stories on arrival so that I understand what NAC does.* *As the Site Admin, I can change the slideshow without a developer.*

### E3 — About Us

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E3-01 | Editable About Us page using the improved copy (founded 2017; brings together grassroots, youth-led and refugee-led organisations; spaces to connect, identify shared priorities and access resources) | A+B | P1 | [New] |
| E3-02 | Key figures block showing **89 organisations** and **15 youth spaces** (values editable, not hard-coded) | A+B | P1 | [New] |
| E3-03 | Support formatted text, headings, links and images | A | P1 | [Proposed] |
| E3-04 | Programme summaries on the About page link to each programme page | A | P2 | [New] |

Note: the "15 youth spaces" figure does not match the number of spaces described in the source document (see 15.1, Q3).

### E4 — Staff directory

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E4-01 | List staff with name, role and optional photo, in admin-defined order | A+B | P1 | [Observed] |
| E4-02 | Only published staff are shown | B | P1 | [Proposed] |
| E4-03 | Optional biography if NAC supplies one. Do not invent biographies | A+B | P3 | [Proposed] |

### E5 — Programmes

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E5-01 | Programmes menu and listing, driven by admin-managed programmes | A+B | P1 | [Observed] |
| E5-02 | Programme detail page: title, image, description, ordered strategies or activities | A | P1 | [Observed] |
| E5-03 | Improved programme copy applied: **GAP** (links to youthgobudgetapp.org and slogbaa.org), **YCR**, **Community Journalism**, **Youth Spaces** | A+B | P1 | [New] |
| E5-04 | Related downloads and stories can be shown on a programme page | A+B | P2 | [Proposed] |
| E5-05 | The Youth Spaces programme page links to the Youth Spaces section (Epic E6) | A | P1 | [New] |

### E6 — Youth Spaces `[New]`

A new public section from the improvements document. It lists physical youth spaces grouped by region: Kampala, West Nile, Western Uganda, Eastern Uganda.

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E6-01 | Youth Spaces landing page with an introduction and spaces grouped by region | A+B | P1 | [New] |
| E6-02 | Each space has a name, region, area/location, description, managing or coordinating partner, and a list of services or activities | A+B | P1 | [New] |
| E6-03 | Optional detail page per space, with photos | A+B | P2 | [Proposed] |
| E6-04 | Admin can add, edit, order, publish and unpublish spaces and regions | B | P1 | [New] |
| E6-05 | Initial data loaded from the improvements document (see Appendix A) | B | P1 | [New] |
| E6-06 | Optional map or location link per space | A | P3 | [Proposed] |

Story seeds: *As a visitor, I can browse youth spaces by region so that I can find one near me.* *As the Site Admin, I can add a new youth space and its managing partner.*

### E7 — Blogs and News

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E7-01 | Article listing with image, title, excerpt, read-more link and pagination | A+B | P1 | [Observed] |
| E7-02 | Article detail page with title, body, image, author (if supplied) and published date | A+B | P1 | [Observed] |
| E7-03 | Share links to social media on each article | A | P2 | [Confirmed] |
| E7-04 | Per-article SEO title, description, slug and sharing image | A+B | P2 | [Proposed] |
| E7-05 | Rich text is sanitised before display | B | P1 | [Proposed] |

### E8 — Opportunities

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E8-01 | Opportunities listing page | A+B | P1 | [Observed] |
| E8-02 | Each opportunity has title, description, type, opening date, closing date, attached documents (PDF, up to 2.5 MB each) | A+B | P1 | [Observed] |
| E8-03 | **Contact information shown on each opportunity** (email, optional phone, application instructions). Applicants apply by email, outside the site | A+B | P1 | [Confirmed] |
| E8-04 | The email contact is a `mailto:` link with a prefilled subject containing the opportunity title | A | P2 | [Proposed] |
| E8-05 | **Status is derived automatically:** Open until the end of the closing date (Africa/Kampala), then Closed. No scheduled job required. Admin may close or archive earlier | B | P1 | [Confirmed] |
| E8-06 | Visitors can filter by **status** (open, closed), **type** and **closing date** (range or sort) | A+B | P1 | [Confirmed] |
| E8-07 | Closed opportunities remain visible, clearly labelled, and are not offered as apply-now | A | P1 | [Proposed] |
| E8-08 | No application form, applicant account or application tracking | — | — | [Confirmed, out of scope] |

Story seeds: *As an applicant, I can see only open opportunities and find the email address to apply.* *As the Site Admin, I set a closing date once and the listing updates itself.*

### E9 — Events

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E9-01 | Events calendar with month, week, day and year views and previous/next navigation | A | P1 | [Observed] |
| E9-02 | Event detail: title, description, start and end date/time, location, image, event contact | A+B | P1 | [Proposed] |
| E9-03 | **Registration link** on an event (external URL). No built-in registration form | A+B | P1 | [Confirmed] |
| E9-04 | **Past events archive:** past events stay browsable, separate from upcoming events | A+B | P1 | [Confirmed] |
| E9-05 | Times stored and shown in Africa/Kampala unless set otherwise | A+B | P1 | [Proposed] |
| E9-06 | Upcoming events list (next events) for the home page and sidebar | A+B | P2 | [Proposed] |
| E9-07 | Cancelled events are labelled, not silently removed | A+B | P2 | [Proposed] |

### E10 — Galleries

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E10-01 | Photo gallery organised by Photo Album, in a responsive grid with lightbox | A+B | P1 | [Observed] |
| E10-02 | Images have captions and alt text | A+B | P2 | [Proposed] |
| E10-03 | Video gallery with title, description and embedded playback from an allowlist of providers (for example YouTube, Vimeo) | A+B | P1 | [Observed] |
| E10-04 | Video entries store a link or embed reference, not arbitrary embed code | B | P1 | [Proposed] |

### E11 — Downloads

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E11-01 | Document library with title, description, category, date and download link, with pagination | A+B | P1 | [Observed] |
| E11-02 | Filter or group by category | A+B | P2 | [Proposed] |
| E11-03 | Latest downloads block reused on home page, footer and programme pages | A+B | P1 | [Observed] |
| E11-04 | **PDF only for documents, maximum 2.5 MB per file**, with a clear message if the limit is exceeded | A+B | P1 | [Confirmed] |
| E11-05 | File size and type shown next to each download | A | P2 | [Proposed] |

### E12 — Contact and inquiries

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E12-01 | Contact page showing physical address, postal address, phone numbers, toll-free line and email, all from site settings | A+B | P1 | [Observed] |
| E12-02 | Clickable phone and email links | A | P2 | [Proposed] |
| E12-03 | **Contact form** with name, email, subject and message, with field validation and success/error feedback | A+B | P1 | [Confirmed] |
| E12-04 | Submitted inquiries are stored and visible to the admin (Epic B4) | B | P1 | [Confirmed] |
| E12-05 | Spam protection (hidden honeypot field, rate limiting, optional privacy-friendly CAPTCHA) | A+B | P1 | [Proposed] |
| E12-06 | Email notification when an inquiry arrives (configurable address; testing address per Q5) | B | P2 | [Confirmed] |

### E13 — Complaints (anonymous)

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E13-01 | Dedicated complaints page with clear instructions, a statement that the complaint is anonymous, and a complaint form | A | P1 | [Confirmed] |
| E13-02 | Form fields: complaint description (required), category or subject (optional), date of incident (optional), programme or place concerned (optional). **No name, email, phone or other identity field** | A+B | P1 | [Confirmed] |
| E13-03 | On submission the visitor sees a confirmation message. No email acknowledgement is possible because no contact is collected | A | P1 | [Confirmed] |
| E13-04 | **Anonymity rules:** do not store IP address, user agent, referrer, cookies or any visitor identifier with a complaint. Do not log complaint content. Exclude the complaint pages from visitor analytics. Do not set tracking cookies on these pages | B | P1 | [Confirmed] |
| E13-05 | Spam and abuse control that does **not** persist identifying data (for example short-lived rate limiting that is never linked to a stored complaint, or a privacy-friendly CAPTCHA) | A+B | P1 | [Proposed] |
| E13-06 | Store the complaint date. Consider storing the date only, not the exact time, to reduce the chance of matching a complaint to a person | B | P2 | [Proposed] |
| E13-07 | No file attachments in v1, because files can carry identifying metadata | A+B | P2 | [Proposed, Open] |

Story seeds: *As a complainant, I can report a concern without giving my name so that I am not exposed.* *As a complainant, I understand what information is and is not recorded.*

### E14 — External links and social media

| ID | Requirement | Dev | P | Src |
|---|---|---|---|---|
| E14-01 | Links to youthgobudgetapp.org and slogbaa.org, editable in site settings | A+B | P1 | [Confirmed] |
| E14-02 | Social media profile links in the footer, editable in site settings | A+B | P1 | [Confirmed] |
| E14-03 | Share buttons on articles, events and opportunities | A | P2 | [Confirmed] |
| E14-04 | WhatsApp action buttons (share / contact), not embedded social feeds or deep platform integration | A | P2 | [Confirmed] |
| E14-05 | Embedded social feeds | A | P3 | [Open] — deferred; may come later |

### E15 — SEO, performance and accessibility (cross-cutting, Dev A)

| ID | Requirement | Dev | P |
|---|---|---|---|
| E15-01 | Unique title, meta description, canonical URL and social sharing metadata on every public page | A | P1 |
| E15-02 | XML sitemap and robots rules. Admin and complaint-submission routes are not indexed | A+B | P1 |
| E15-03 | Redirects from legacy nacuganda.org URLs where paths change | A+B | P1 |
| E15-04 | Optimised, resized images and lazy loading. Avoid unnecessary client-side JavaScript | A | P1 |
| E15-05 | Target WCAG 2.2 AA: semantic landmarks, keyboard operation, visible focus, labelled forms, alt text, colour contrast, reduced motion | A | P1 |
| E15-06 | Current Chrome, Edge, Firefox, Safari, plus common Android and iOS browsers | A | P1 |
| E15-07 | Privacy notice page describing visitor statistics and how complaints are handled | A+B | P2 |

---

## 7. Back office requirements (Dev B)

### B1 — Authentication (single admin)

| ID | Requirement | P | Src |
|---|---|---|---|
| B1-01 | One administrator account protects the admin portal. All `/admin` pages and admin actions require login | P1 | [Confirmed] |
| B1-02 | Secure password hashing, secure HTTP-only cookies, session expiry, logout | P1 | [Proposed] |
| B1-03 | Login rate limiting and generic error messages | P1 | [Proposed] |
| B1-04 | Authorisation is enforced on the server for every admin operation, never only by hiding pages | P1 | [Proposed] |
| B1-05 | Password reset via email | P2 | [Confirmed] |
| B1-06 | Multi-factor authentication | P3 | [Proposed] |
| B1-07 | Data model keeps a `role` field so more users and roles can be added later without redesign | P3 | [Proposed] |

Story seeds: *As the Site Admin, I sign in securely to manage the site.* *As the iONA team, I can reset access if the admin is locked out.*

### B2 — Admin dashboard

A general dashboard is the landing page after login. Content types are managed on separate pages (B3).

| ID | Requirement | P | Src |
|---|---|---|---|
| B2-01 | **Visitor count:** total visits and unique visitors for today, last 7 days, last 30 days and all time, with a trend chart | P1 | [Confirmed] |
| B2-02 | Page views for the same periods | P1 | [Proposed] |
| B2-03 | Most visited pages (top 10) | P2 | [Proposed] |
| B2-04 | Traffic sources: direct, search engines, social media, other sites (referrer host) | P2 | [Proposed] |
| B2-05 | Visitor country (and city where available) | P2 | [Proposed] |
| B2-06 | Device type (mobile, tablet, desktop), browser and operating system | P2 | [Proposed] |
| B2-07 | Most downloaded documents and most viewed articles and opportunities | P3 | [Proposed] |
| B2-08 | Content summary: counts of published and draft items by content type | P2 | [Proposed] |
| B2-09 | Attention list: new inquiries, new complaints, opportunities closing soon, upcoming events | P1 | [Proposed] |
| B2-10 | Recently updated content | P3 | [Proposed] |
| B2-11 | Quick links to create an article, download, opportunity, event, team member and so on | P1 | [Proposed] |
| B2-12 | Complaint information on the dashboard is limited to a count of new items, never complaint text | P1 | [Confirmed] |

See Section 9 for what visitor information is available, how it is collected and the privacy rules.

### B3 — Content management (one page per content type)

Every content type has its own **list page** (search, sort, filter, pagination where useful) and **create/edit page**, with server-side validation, preview, and publish/unpublish. Confirm before delete. Prefer archive over hard delete.

| ID | Content type (menu label) | Admin capability | P | Src |
|---|---|---|---|---|
| B3-01 | Blog / News Article | Create, edit, preview, publish, unpublish, archive; image, author, SEO fields | P1 | [Observed] |
| B3-02 | Download | Upload PDF (**max 2.5 MB**), replace file, edit metadata and category, publish, archive | P1 | [Observed] |
| B3-03 | Featured Concept | Create, edit, order, publish | P2 | [Observed] |
| B3-04 | Opportunity | Create, edit, set type and dates, contact details, attach PDFs (max 2.5 MB each), publish, close early, archive. Status shown as derived | P1 | [Observed] |
| B3-05 | Partner | Name, logo, link, order, publish | P2 | [Observed] |
| B3-06 | Photo Album | Create album, add/remove/reorder images, captions, alt text, publish | P1 | [Observed] |
| B3-07 | Programme | Description, image, ordered strategies, order, publish | P1 | [Observed] |
| B3-08 | Slideshow Image | Upload/replace image, caption, alt text, link, order, publish | P2 | [Observed] |
| B3-09 | Team Member | Name, role, photo, order, publish | P1 | [Observed] |
| B3-10 | Upcoming Event | Title, description, date/time, location, image, registration link, contact, publish, cancel, archive | P1 | [Observed] |
| B3-11 | Video Link | URL from allowed providers, title, description, thumbnail, order, publish | P1 | [Observed] |
| B3-12 | Youth Space and Region | Name, region, location, partner, description, services list, photos, order, publish | P1 | [New] |
| B3-13 | About Us page and Key Figures | Edit About text and key figure values (for example organisations, youth spaces) | P1 | [New] |
| B3-14 | Draft and published states. Admin publishes directly, no approval step | P1 | [Confirmed] |
| B3-15 | Creation and last-updated timestamps on all records | P1 | [Proposed] |
| B3-16 | No revision history or restore of earlier versions | — | [Confirmed, out of scope] |

### B4 — Inquiry inbox

| ID | Requirement | P | Src |
|---|---|---|---|
| B4-01 | List inquiries with date, name, subject and read/unread state | P1 | [Confirmed] |
| B4-02 | View full inquiry details | P1 | [Confirmed] |
| B4-03 | Mark read/unread, archive and delete | P2 | [Proposed] |
| B4-04 | Search and filter by date or state | P3 | [Proposed] |

### B5 — Complaints inbox (restricted and anonymous)

| ID | Requirement | P | Src |
|---|---|---|---|
| B5-01 | The Site Admin sees each complaint with its **date** and submitted details in the admin portal | P1 | [Confirmed] |
| B5-02 | List view with date, category and status (new, reviewed, closed) and detail view | P1 | [Confirmed] |
| B5-03 | Admin can change the status and add private notes | P2 | [Proposed] |
| B5-04 | **Nothing that identifies the complainant is stored or shown** (no IP, device, location, referrer, session) | P1 | [Confirmed] |
| B5-05 | Complaint data is never returned by any public route and never appears in analytics, exports or logs | P1 | [Confirmed] |
| B5-06 | Retention and deletion rule: admin can delete a complaint. Automatic retention period to be set by NAC | P2 | [Open] |

### B6 — Site settings (configuration)

| ID | Requirement | P | Src |
|---|---|---|---|
| B6-01 | Edit physical address, postal address, phone numbers, toll-free number, email (used across site) | P1 | [Observed] |
| B6-02 | Edit social profile links and the external service links (youthgobudgetapp.org, slogbaa.org) | P1 | [Confirmed] |
| B6-03 | Edit homepage section order and visibility | P2 | [Proposed] |
| B6-04 | Edit the list of opportunity types and document categories | P2 | [Proposed] |
| B6-05 | Navigation menu editing (Structure area) — not required for v1; Dashboard + Content only (Q6) | — | [Confirmed, out of scope] |

### B7 — Media and file uploads

| ID | Requirement | P | Src |
|---|---|---|---|
| B7-01 | **PDF documents: maximum 2.5 MB.** Reject larger files on the client and again on the server with a clear message | P1 | [Confirmed] |
| B7-02 | Images: JPEG, PNG, WebP. **Maximum 2.5 MB** (same as PDFs). Resize or compress large images before upload | P1 | [Confirmed] |
| B7-03 | Validate file type by content, not only by extension | P1 | [Proposed] |
| B7-04 | Store files in object storage, store only metadata and the file URL in the database | P1 | [Proposed] |
| B7-05 | Replacing a document keeps its public URL working | P2 | [Proposed] |
| B7-06 | Generate image sizes or thumbnails for gallery and cards | P2 | [Proposed] |

### B8 — Visitor analytics collection

| ID | Requirement | P | Src |
|---|---|---|---|
| B8-01 | Record one lightweight event per public page view without cookies and without storing the raw IP address | P1 | [Confirmed need] |
| B8-02 | Estimate unique visitors per day using a hashed identifier with a salt that rotates daily, so a person cannot be followed across days | P1 | [Proposed] |
| B8-03 | Collect only: page path, referrer host, country/region/city (from platform geo headers), device class, browser, operating system, timestamp | P1 | [Proposed] |
| B8-04 | Exclude admin pages, the complaint pages, known bots and crawlers, and repeated refreshes by the same visitor within a short window | P1 | [Proposed] |
| B8-05 | Store daily summaries and delete or roll up raw rows after a short period to stay within free database limits | P1 | [Proposed] |
| B8-06 | Count document downloads and article/opportunity views | P3 | [Proposed] |
| B8-07 | Use the once-a-day cron (Hobby limit) for roll-ups and cleanup | P2 | [Proposed] |

### B9 — Data access and security

| ID | Requirement | P | Src |
|---|---|---|---|
| B9-01 | Typed data-access functions for every public read (published content only, paginated, bounded) | P1 | [Proposed] |
| B9-02 | Draft, archived and unpublished content never reaches public pages | P1 | [Proposed] |
| B9-03 | Server-side validation and consistent error responses for all inputs | P1 | [Proposed] |
| B9-04 | Rich text sanitised to prevent stored cross-site scripting | P1 | [Proposed] |
| B9-05 | Rate limiting on login and on public forms | P1 | [Proposed] |
| B9-06 | Security headers and HTTPS only | P1 | [Proposed] |
| B9-07 | Database and file backups with a tested restore process, in NAC-owned accounts | P1 | [Proposed] |
| B9-08 | Help page in the admin portal with content-entry guidance and iONA support contact | P3 | [Observed] |
| B9-09 | Reports: replaced by the dashboard. Structure/Configuration/Comments not required for v1 (Q6) | — | [Confirmed, out of scope] |

---

## 8. Opportunity status rule (for story acceptance)

- An opportunity is **Open** when its opening date is reached (if set) and the closing date has not passed (end of day, Africa/Kampala).
- It is **Closed** after the closing date, or when the admin closes it early.
- It is **Archived** when the admin archives it. Archived items are hidden from the public list.
- Status is calculated when the page is read. No scheduled job is needed.
- Opportunities with no closing date stay Open until the admin closes them.

---

## 9. Visitor information shown to the admin

The dashboard must show a visitor count. The following basic information can also be collected **without cookies or personal data**, from the request itself. Priorities match B2 and B8.

| Information | What the admin learns | How it is obtained | P |
|---|---|---|---|
| Total visits, unique visitors, page views | Overall reach and growth | Event per page view, daily hashed visitor id | P1 |
| Trend over time | Effect of a news post, event or campaign | Daily counts | P1 |
| Most visited pages | What people care about | Page path | P2 |
| Traffic sources | Whether visitors come from search, social media, partners or direct links | Referrer host | P2 |
| Country and city | Where the audience is, including diaspora and partners | Platform geo headers | P2 |
| Device, browser, operating system | Whether to optimise for mobile first (likely in Uganda) | User agent, classified then discarded | P2 |
| Most downloaded documents, most viewed articles and opportunities | Which content is useful | Download and view counters | P3 |
| Time of day and day of week | Best time to publish | Event timestamp | P3 |
| Browser language | English or other language needs | Accept-Language header | P3 |

**Not available or not recommended**

- Exact identity, names, emails or phone numbers of visitors.
- "New versus returning" visitors, because that needs persistent cookies. Skip unless NAC accepts a cookie notice.
- Anything about complaint submissions. The complaint pages are excluded (E13-04).

**Privacy rules for analytics**

1. No third-party advertising trackers.
2. No raw IP storage. No cross-day visitor tracking.
3. Show a short plain-language statement on the privacy page (E15-07).
4. Third-party tools (for example a hosted analytics service) may be added later, but their dashboards would be separate from the admin portal. The first-party approach keeps statistics inside the portal.

---

## 10. Data model (conceptual)

| Entity | Key fields |
|---|---|
| AdminUser | id, name, email, passwordHash, role (default `admin`), createdAt |
| Page / AboutContent | id, key, title, body, updatedAt |
| KeyFigure | id, label, value, sortOrder |
| Programme | id, title, slug, summary, body, image, strategies (ordered), sortOrder, status |
| YouthRegion | id, name, sortOrder |
| YouthSpace | id, regionId, name, slug, location, description, managingPartner, services (list), images, sortOrder, status |
| TeamMember | id, name, role, photo, sortOrder, status |
| Article | id, title, slug, excerpt, body, coverImage, author, publishedAt, status, SEO fields |
| Opportunity | id, title, slug, type, description, openingDate, closingDate, contactEmail, contactPhone, applicationInstructions, attachments, manualStatus (none, closed, archived), status |
| Event | id, title, slug, description, startAt, endAt, timezone, location, image, registrationUrl, contact, status |
| PhotoAlbum / PhotoImage | album: id, title, cover, sortOrder, status. image: id, albumId, file, caption, altText, sortOrder |
| VideoLink | id, title, description, provider, url, thumbnail, sortOrder, status |
| Document | id, title, description, category, fileUrl, fileType, fileSize (max 2.5 MB), publishedAt, downloadCount, status |
| Partner | id, name, logo, websiteUrl, sortOrder, status |
| FeaturedConcept | id, title, summary, image, destinationUrl, sortOrder, status |
| SlideshowImage | id, image, caption, altText, destinationUrl, sortOrder, status |
| SiteSetting | key, value (addresses, phones, email, social links, external links, homepage layout) |
| Inquiry | id, name, email, subject, message, isRead, createdAt |
| Complaint | id, description, category (optional), incidentDate (optional), programmeOrPlace (optional), status, adminNotes, submittedOn (date). **No identifying fields** |
| AnalyticsDaily | date, path, referrerHost, country, city, device, browser, os, views, uniqueVisitors |

Use unique constraints on slugs and admin email, and indexes on status, dates and common listing queries.

---

## 11. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | Responsive on mobile, tablet, laptop and desktop. Mobile-first, since many users browse on phones |
| NFR-02 | Public pages served fast, with Core Web Vitals targets agreed during build |
| NFR-03 | HTTPS in production. Secrets in environment variables only |
| NFR-04 | WCAG 2.2 AA target for the public site. Admin portal usable on desktop and tablet |
| NFR-05 | Server-side validation and authorisation on every protected operation |
| NFR-06 | Public lists paginated or bounded |
| NFR-07 | Backups of database and files, with a documented restore |
| NFR-08 | Version-controlled, repeatable database migrations |
| NFR-09 | Automated tests for critical journeys (Section 13) and for protected operations |
| NFR-10 | Privacy by design: collect the minimum, follow the Uganda Data Protection and Privacy Act, 2019, and any extra rules NAC supplies (12.6.24) |
| NFR-11 | Stay within free-tier limits of hosting, database and storage, with usage monitored |

---

## 12. Content migration (all existing content)

NAC confirmed that **all existing content** will be migrated.

**To migrate:** organisation profile and mission/vision, staff, programmes, blog/news articles and images, opportunities and documents, events, photo albums, videos, downloads and metadata, partners, contact details, featured concepts, slideshow images, and homepage promotional content.

**New or improved content to load from the improvements document:** the new About Us text and key figures, the revised programme descriptions, and the Youth Spaces section (Appendix A).

**Rules**

1. Keep original wording unless NAC approves changes. The improvements document overrides older text where they differ.
2. Keep original publication dates and authors where verified.
3. Check every document: PDFs larger than **2.5 MB** must be compressed, split, or left out of the first import (R6).
4. Flag duplicate, outdated, expired or broken items for NAC review. Do not republish expired opportunities as open.
5. Preserve legacy URLs where possible and create redirects where they change.
6. Confirm image rights. NAC supplies logos, brand guidelines, fonts, photographs and partner logos (12.5.17).
7. Run migration as scripts by Dev B, not through the web app.

---

## 13. Acceptance criteria and key journeys

**End-to-end journeys (each should become automated tests where practical)**

1. A visitor opens the home page and navigates to About Us and a programme page.
2. A visitor browses Youth Spaces by region.
3. A visitor reads a news article and shares it.
4. A visitor filters opportunities to Open, opens one and sees the contact email.
5. An opportunity passes its closing date and is shown as Closed without admin action.
6. A visitor browses the calendar in month, week, day and year views, opens an event and follows its registration link.
7. A visitor finds a past event in the archive.
8. A visitor downloads a PDF. Uploading a PDF or image larger than 2.5 MB is rejected.
9. A visitor submits the contact form and the admin sees it in the portal.
10. A visitor submits an anonymous complaint. The admin sees the complaint and its date. No identifying data exists in the database record or logs.
11. The Site Admin signs in, sees visitor counts on the dashboard, creates and publishes an article, and sees it on the site.
12. The Site Admin edits the About page, a staff member, a programme and site contact details.
13. An unauthenticated user cannot open any admin page or call any admin operation.
14. Draft and archived content is not visible publicly.

**Frontend accepted when:** all pages and navigation exist, pages work on agreed screen sizes, forms validate and give feedback, filters and calendar views work, accessibility and SEO checks pass.

**Back office accepted when:** the Site Admin can manage every content type from its own page, the dashboard shows visitor statistics, inquiries and complaints reach the admin, uploads enforce limits, access control is enforced on the server, and backups have been tested.

---

## 14. Out of scope

- Rebuilding Youth Go Budget (Android or web) or SLOGBAA. Linked only.
- Applicant accounts, online applications, application tracking or review.
- Event registration forms, ticketing or payments (registration links only).
- Revision history and restoring earlier versions (12.1.5).
- Multiple administrator accounts, roles and approval workflows (12.1.2, 12.1.3). Architecture allows adding later.
- Complaint case management, attachments or follow-up with the complainant.
- Public comments (an item exists in the old admin menu), unless NAC later confirms they are needed.
- Membership or CBO registration platform, donor management, programme monitoring.
- Email hosting or mailbox migration.

---

## 15. Open items and risks

### 15.1 Questions still open

| #   | Question                                                                                                                                                                                                                                                                                | Needed for      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Q1  | Which programme list is final: four (GAP, YCR, Community Journalism, Youth Spaces) or the earlier five? What happens to Youth CSO Village and C4D?                                                                                                                                      | E5, nav, B3-07  |
| Q2  | Does "Governance and Participation (GAP)" replace "GAAP"?                                                                                                                                                                                                                               | E5              |
| Q3  | The document says 15 youth spaces but describes 13 (and Kunya appears twice, see Appendix A). Which spaces are final, and is Kunya one space or two? Also confirm the spelling of names such as Kitintale and Afrikovikoo                                                               | E6, key figures |
| Q4  | Retention period and deletion rules for complaints                                                                                                                                                                                                                                      | B5-06           |
| Q5  | Should NAC receive an email when an inquiry arrives, and at which address? [Yes, for now (testing) at [2060newty@gmail.com](mailto:2060newty@gmail.com) - we shall change it later]                                                                                                     | E12-06          |
| Q6  | The existing admin shows Structure, Configuration, Reports, Help and Comments. What do these do today, and which are still needed? (12.5.21 confirmed there are other private features, especially in the admin portal) [The only one necessary was the Dashboard and Content sections] | B6-05, B9-09    |
| Q7  | Password recovery approach for the single admin [via email]                                                                                                                                                                                                                             | B1-05           |
| Q8  | Social media: which accounts, and are embedded feeds wanted or only share and profile links? [ WhatsApp buttons, not actual integration - this may be in the future]                                                                                                                    | E14             |
| Q9  | What are NAC's privacy, residency and security requirements (12.6.24 says they exist)?                                                                                                                                                                                                  | NFR-10          |
| Q10 | Image upload size cap: confirm 4 MB for images too [2.5 MB for both PDF and images]                                                                                                                                                                                                     | B7-02           |
| Q11 | Opportunity types list and document categories to start with [Volunteer]                                                                                                                                                                                                                | B6-04           |

### 15.2 Risks

| ID  | Risk                                                                                                                                                           | Mitigation                                                                                                                                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1  | **Vercel Hobby is for personal, non-commercial use.** A public site for an organisation may not comply with those terms, and the plan could be restricted      | Confirm with NAC and Vercel terms. Plan a fallback: Vercel Pro, or another host that suits a non-profit website. Keep the app host-neutral                                                                               |
| R2  | Hobby allows one team member and does not support private repositories owned by a GitHub organisation. Two developers plus NAC ownership complicate deployment | Decide repository ownership and who connects deployments. Developers can work in pull requests while one account owner deploys, or upgrade the plan [This is the case - one account owner deploys and upgrades the plan] |
| R3  | 4.5 MB request limit and short function duration                                                                                                               | 2.5 MB cap, direct-to-storage uploads, migration by script                                                                                                                                                                 |
| R4  | Free database or storage tiers may run out, especially with analytics and a large media archive                                                                | Roll up analytics, compress media, monitor usage                                                                                                                                                                         |
| R5  | Complaint anonymity can be broken by logs, analytics, timestamps or file metadata                                                                              | Rules E13-04 to E13-07, review before launch                                                                                                                                                                             |
| R6  | Old content is outdated or in files above 2.5 MB [Leave oversized files out of the first import]                                                                                      | NAC review, compress or split PDFs                                                                                                                                                                                       |
| R7  | Admin portal features that are not yet known (Q6)                                                                                                              | Walkthrough of the current admin before sprint planning                                                                                                                                                                  |
| R8  | Single admin account is a single point of failure [ we shall have more later as need be]                                                                       | Documented recovery process, NAC-owned credentials stored safely                                                                                                                                                         |

---

## 16. Suggested delivery order

| Sprint | Dev A (Frontend) | Dev B (Back office) |
|---|---|---|
| 0 | Repo, design tokens, layout shell | Repo, schema, seed data, auth skeleton, CI |
| 1 | Header, footer, home, About, Staff (E1 to E4) | Login, dashboard shell, Team Member, Programme, About/Key Figures, Site Settings (B1, B3, B6) |
| 2 | Programmes, Youth Spaces, News (E5 to E7) | Article, Youth Space, Download, uploads with 2.5 MB rules (B3, B7) |
| 3 | Opportunities with filters, Events calendar, archive (E8, E9) | Opportunity and Event admin, derived status, public data access (B3, B9) |
| 4 | Galleries, Downloads, Contact, Complaints UI (E10 to E13) | Albums, videos, inquiry and complaint inboxes, anonymity controls (B4, B5) |
| 5 | SEO, accessibility, performance, share links, privacy page (E14, E15) | Visitor analytics and dashboard statistics (B2, B8), backups |
| 6 | QA fixes, redirects | Content migration scripts, security review, handover and admin training |

---

## Appendix A — Youth Spaces seed content (from the improvements document)

Source text should be loaded as supplied and reviewed by NAC (see Q3).

**Programme summary:** NAC has established 15 youth spaces that work as youth co-creation, youth enterprise incubation and refugee engagement hubs in West Nile, the Central region, and eastern and western Uganda. Grassroots organisations use them for administrative support, shared capacity and collective civic action.

| Region | Space | Managing / coordinating partner | Notes from source |
|---|---|---|---|
| Kampala | Kisaasi Youth Space | Not stated in source | Shared workspace and virtual office addresses for 20 organisations; Youth Café with free or subsidised Wi-Fi, computers and printing; English classes for newly arrived urban refugees; hosts the annual Youth CSO Market (30+ youth-led groups) |
| Kampala | Kinawataka Youth Space | OBOIVU (One By One Initiative for Vulnerable Communities in Uganda), an NAC member | Reading space and cinema, night reading, urban garden with free seedlings, local small enterprise |
| Kampala | Kamwanyi Youth Space | HADE (Holistic Action for Development and Empowerment), an NAC member | On the shore of Lake Victoria; 20+ youth social entrepreneurs; women-led multifunctional space; container shop for water hyacinth and bamboo products |
| Kampala | Kitintale Youth Space | Civact, an NAC member | Village meetings, youth parliament with local leaders, partner meetings |
| Kampala | Kawempe Youth Centre / Space | Kawempe Youth Centre (KYC) | Urban garden and a community library |
| Kampala | Kyebando Youth Space | Eco Smart Innovations Initiative | Free internet, shelter from heat, children's play, learning, CSO and NGO events, skilling |
| Kampala | Kanyanya Youth Space | Sustainable Community Initiative for Empowerment | Public green space near Kanyanya Church of Uganda Primary School; children's right to play, learning, social hub |
| Kampala | Kirombe Youth Space | Footmarks Initiative Uganda | Public green space; urban agriculture demonstration garden; CSO and NGO events; skills development |
| Kampala | Kunya Youth Space (entry 1) | Afrikovikoo Hub with the school | Public green space at Uganda Youth Primary School; urban farming demonstration garden; vocational training |
| Kampala | Kunya Youth Space (entry 2) | She for Change (women-led) | Self-employable skills, peer learning on digital skills, women's savings group meetings. `[Open]` Same space as entry 1? |
| West Nile | Arua Youth Space | Host Hub Innovation Centre (established 2021) | Co-working and peer learning; regional media (NBS West Nile Region, Capital FM West Nile); digital storytelling ("Next Creata Fellowship") |
| West Nile | Yumbe Youth Space | HADE | 10 local organisations share the space; reliable electricity, internet and workspace; base for collaboration |
| Western Uganda | Ntugamo Youth Space | n/a in source | Only youth space in western Uganda; meeting point for political youth leaders on local budgets and government programmes |
| Eastern Uganda | Mayuge Youth CSO space | Hope Alive initiative | Community CSO hub, community library, resource centre; sports groups use it as a meeting point |

**Key figures from the source:** 89 organisations in the network; 15 youth spaces; founded 2017.

---

## Appendix B — Approval

| Name / Role               | Signature        | Date |
| ------------------------- | ---------------- | ---- |
| NAC Representative        | Nakkito Patricia |      |
| iONA Tech Project Lead    | Samuel Katongole |      |
| Developer A (Frontend)    |                  |      |
| Developer B (Back office) |                  |      |