# NAC Website Rebuild

**Requirements and User Stories**

One combined list of requirements from the client meeting on 9 November 2026 and the iONA development-team meeting on 10 November 2026, for the team to build from.

| | |
| --- | --- |
| **Client** | NAC, a network of youth organisations. (The transcripts also write the name as “NARC”, “NAAC” and “Nak”; all are read here as NAC.) |
| **Meetings** | 9 Nov 2026, client meeting (49 min): https://fathom.video/share/-sQtQHSsyCfGbPYTP9xWC8BFkDzzi3eP · 10 Nov 2026, iONA dev team (43 min): https://fathom.video/share/oWhbj93Zdy7PsjvF8Aqe5GKxQwyJajYK |
| **People** | **9 Nov:** Peniel Rwendeire (NAC Executive Director), Patricia Nakitto (NAC), Samuel Katongole and Elijah Nyombi (iONA). **10 Nov:** Samuel Katongole, Elijah Nyombi, Allan Baliddawa, Lilian Nankunda (iONA). |
| **Prepared by** | iONA Tech, November 2026 |
| **Status** | Draft for the team and NAC to confirm. Items marked *(proposed)* are additions that nobody stated in the meetings. |

---

## 1. Background and Goal

NAC wants a website that clearly shows who it is and what it does. It is a network of youth organisations with about 15 youth spaces, and its work is strong but the current site does not communicate it to partners and funders. NAC plans to present the updated site from **1 December 2026**.

The current site was built with the Drupal content management system, in PHP. iONA does not work with PHP or content management systems and cannot convert the code, so the team will rebuild the site on its own stack. It will keep the content that should stay and follow the current design or improve it, with a back office that NAC staff can use.

The two main additions NAC asked for are **Youth Spaces** and **Members and partners**. NAC also wants a living events calendar, a better gallery and video section, and a site that is more beautiful and attractive.

---

## 2. Design Inspiration

Use these as references for layout, content and how the site is kept up to date. The aim is to come close to them, and where possible to do better, not to copy them.

| Reference | What to borrow | Notes |
| --- | --- | --- |
| **DreamTown** ([dreamtown.org](https://dreamtown.org)) | The overall look and especially its drop-down menus. Its “spaces” section, shown by country on a map under “where we work”, is the model for NAC's Youth Spaces, with each space linked to the partner that runs it. | The client's first choice. The design is acceptable; the team aims to make NAC's site even better. The 9 Nov transcript gives the address as dreamtown.ngo, so please confirm which is right. |
| **NAC's current website** | Keep the structure (Home, About us, Programs, Opportunities, Events, Gallery, Videos, Staff, Partners) and the sliding homepage banner, which the client loves. | The old design is judged not nice; the calendar in particular needs redesign. |
| **A partner-showcase site shown by the client** | Each partner has a short write-up, a photo or video, and a link to its own website. | The site's name was not captured in the meeting; NAC to share it. |
| **Deniva** (network membership page) | A short listing of member organisations with a little about each. | A rough guide only; the client said it does not fully show what NAC wants. |
| **Jumia and restaurant-menu sites** | How content stays fresh: owners keep adding products or menu items. | Update model only, not a design reference. |
| **A homepage with background video** | A video playing in the background of the home page, as seen on a reference site on screen. | An idea from the dev team; the site was not named (likely DreamTown, to confirm). |

---

## 3. Delivery Plan

### 3.1 Timeline and phases

| Phase | Date | What it covers |
| --- | --- | --- |
| **Phase 1 — Presentable site** | Thursday 26 November 2026 (iONA's internal deadline) | Everything tagged Phase 1 below. The client presents the site on Monday 30 November, so 26 November leaves a few days for review and fixes. |
| **Phase 2 — Improvements** | After 26 November, in the background | Everything tagged Phase 2: member filters and detail pages, space map and coaches, opportunities, the homepage video, visitor analytics and security hardening. |

The team has this week, next week and the week of 22 November (about 22 to 27, possibly 29) for reviews and deployment. Dates are as discussed in the meetings.

### 3.2 Team and roles

| Person | Role in this project |
| --- | --- |
| **Samuel Katongole** | Writes the requirements, gets the current back-office and database credentials, sends the correct logo and reference documents, creates the GitHub repository, and talks to finance about the AI coding tool. Main contact with NAC. |
| **Allan Baliddawa** | Starts the project. Handles the Frontend. |
| **Lilian Nankunda** | Back office (admin section) and back end. She first reviews the existing back office and database once the credentials arrive. |
| **Elijah Nyombi** | Contributor to the repository; recalled client requirements for partners, the calendar and visitor analytics. |

### 3.3 Technical decisions

| Topic | Decision | Notes |
| --- | --- | --- |
| **Approach** | Rebuild the site. Do not convert the PHP code. | No direct conversion tool exists; the old design and content are carried over. |
| **Stack** | Next.js with TypeScript for both the front end and the back end, including the back office. | The team agreed to use NextJS instead of NestJS, along with Typescript for both the Frontend and Backend. |
| **Hosting** | Deploy everything on Vercel, using a single repository (monorepo) with the front end and back end together. | Done before for PharmaChain, Joblify and iONA's website, where Vercel has not charged. A Java back end is ruled out by this choice. If the team has not set up a monorepo like this before, it learns how. |
| **Database** | Review the existing SQL database (probably MySQL) from the Drupal site once the credentials arrive. | The database for the new site is not yet chosen; it must work with Vercel deployment. |
| **Version control** | A GitHub repository, with Elijah, Allan and Lilian added as contributors. | Samuel creates it. |
| **Code quality** | If to use AI, let it be used intelligently: keep the code well structured, well organised and easy to maintain, so someone without AI can review or change it. | The team learns how to guide the AI to write maintainable code. |

---

## 4. User Stories

**Actors:** a visitor (a partner, funder, young person or member), a NAC administrator such as Patricia, NAC as the organisation, and a developer.

In each Source line, “9 Nov” is the client meeting and “10 Nov” is the dev-team meeting; times refer to the recordings.

### Epic A — Navigation and structure

#### NAC-01 Youth Spaces menu — PHASE 1

**Story:** As a visitor, I want a “Youth Spaces” drop-down in the main menu that lists the youth spaces, so that I can explore NAC's work space by space.

**Acceptance criteria:**

- “Youth Spaces” is a main menu item with a drop-down listing every space by name (about 15 today), grouped by region (NAC-06).
- Choosing a space opens that space's page (NAC-05).
- A space added or removed in the back office changes the menu without developer help.
- The menu works on phones and tablets *(proposed)*.

**Source:** 9 Nov 14:51–21:00 and 35:44. 10 Nov 0:00–1:16 and 8:05–17:27.

#### NAC-02 Members and partners menu — PHASE 1

**Story:** As a visitor, I want a “Members” section in the main menu, so that I can see the organisations that make up the NAC network.

**Acceptance criteria:**

- “Members” sits next to Youth Spaces and opens the members and partners directory (NAC-09).
- The menu works on phones and tablets *(proposed)*.

**Source:** 9 Nov 21:00–24:04 and 35:44. 10 Nov 19:01–27:55. The 9 Nov meeting says “members” and the 10 Nov meeting says “partners” for the same organisations; please confirm the name.

#### NAC-03 Keep the existing sections — PHASE 1

**Story:** As a visitor, I want the existing sections to stay and be improved, so that I can still find NAC's familiar content.

**Acceptance criteria:**

- Home, About us, Programs, Opportunities, Events, Gallery, Videos, Staff and Partners remain.
- Existing content is carried over and refreshed where NAC supplies new content.
- Each section is reviewed and improved in design (NAC-31).

**Source:** 9 Nov 14:51–18:01. 10 Nov 1:16–2:11 and 8:05–17:27.

### Epic B — Programs

#### NAC-04 Program pages — PHASE 1

**Story:** As a visitor, I want each NAC program to have a page with current content and good pictures, so that I understand what NAC does.

**Acceptance criteria:**

- The current programs stay: Governance and Participation, Youth Climate Resilience, Communication for Development, Youth Organizing and Strengthening.
- Other running programs are added, with NAC listing them.
- Each page has content from NAC's document, newer pictures in place of the old ones, and more information than today.
- The Governance and Participation page covers YGB and Slogba, with content and images supplied by NAC.

**Source:** 10 Nov 8:05–17:27 (the programs are as read from the current site on screen).

### Epic C — Youth Spaces

#### NAC-05 Youth space page — PHASE 1

**Story:** As a visitor, I want each youth space to have its own page with pictures, a short description and a link to its coordinating partner, so that I can learn about it and reach the partner.

**Acceptance criteria:**

- Each page shows the space name, pictures and a short description.
- The coordinating partner's name links to that partner's website.
- A space can also list the organisations it hosts, such as media partners (to confirm).
- NAC can add, edit and remove spaces in the back office (NAC-20).

**Source:** 9 Nov 18:13–22:27 and 31:14–34:46. 10 Nov 8:05–17:27.

#### NAC-06 Spaces by region — PHASE 1

**Story:** As a visitor, I want to see where the youth spaces are, grouped by region, so that I understand NAC's reach.

**Acceptance criteria:**

- Spaces are grouped by region: Kampala, West Nile, Western Uganda and Eastern Uganda, as in NAC's document (to confirm).
- A “where we work” view takes its idea from DreamTown, which uses a country map. A map is a nice extra for Phase 2, and a grouped list is enough for Phase 1 *(proposed)*.

**Source:** 10 Nov 8:05–17:27.

#### NAC-07 Space coaches — PHASE 2

**Story:** As a visitor, I want to see the coaches of a youth space and what they do, so that I know who runs it.

**Acceptance criteria:**

- A space page can show its “YY coaches” with their roles and optionally a photo.
- What to show for each coach needs NAC's confirmation, because the transcript is unclear.

**Source:** 9 Nov 18:13–21:00. Wording unclear in the transcript.

### Epic D — Members, partners and network positioning

#### NAC-08 Show NAC as a network, with results — PHASE 1

**Story:** As a prospective partner or funder (for example an embassy), I want the site to show that NAC is a network of youth organisations and to present what it does and the results it achieves, so that I understand its reach and want to work with it.

**Acceptance criteria:**

- The home page and About us present NAC as a network that brings several organisations together. The dev team called this crucial.
- Key facts are easy to see, such as the 15 youth spaces, the members and partnerships (for example with the British Council Youth Connect).
- Stories and results are shown, with NAC supplying the facts and pictures.
- Claims such as awards are published only after NAC confirms them.

**Source:** 9 Nov 14:51–15:40 and 28:12–36:42. 10 Nov 8:05–17:27.

#### NAC-09 Members and partners directory — PHASE 1

**Story:** As a visitor, I want a dedicated page or section for NAC's members and partners, with a short write-up on each, so that I can learn about them and follow a link to their sites.

**Acceptance criteria:**

- Each organisation shows its name, logo, a short write-up, a photo or video, telephone, email and location.
- The organisation's name links to its own website.
- This replaces the plain list of logos that link straight out of the site today.
- NAC manages all entries in the back office (NAC-21).

**Source:** 9 Nov 21:00–24:04. 10 Nov 18:00–27:55 (Elijah's recollection of what the client showed).

#### NAC-10 Browse members by region or theme — PHASE 2

**Story:** As a partner looking for an organisation in a particular area, I want to browse members by region (for example West Nile or Eastern Uganda) or by theme, so that I can find the right member quickly.

**Acceptance criteria:**

- Members can be grouped or filtered by region, by theme, or both (NAC to choose).
- Each member is assigned to at least one region or theme.

**Source:** 9 Nov 22:27–24:04.

#### NAC-11 Member detail page — PHASE 2

**Story:** As a visitor, I want to open a member's own page with a little more detail and a link to its website.

**Acceptance criteria:**

- Choosing a member opens a short page with its details and website link.
- The idea came from iONA and the client agreed in principle; please confirm.

**Source:** 9 Nov 22:00–22:27.

### Epic E — Events and opportunities

#### NAC-12 Upcoming events calendar — PHASE 1

**Story:** As a visitor, I want to see NAC's upcoming events on a calendar, so that I know what is coming and when.

**Acceptance criteria:**

- The calendar shows each event's date, time, title and a short description, and its design is improved over the current one.
- An event can carry a link, such as a Facebook post.
- As a first example, the AGM (given in the meeting as 14 November) is listed.

**Source:** 9 Nov 14:51–18:01. 10 Nov 8:05–18:00. The AGM date was an example, so please confirm it.

#### NAC-13 Past events stay visible — PHASE 1

**Story:** As a visitor, I want events that have already happened to stay on the calendar with a link, so that I can see what took place.

**Acceptance criteria:**

- Past events remain in the calendar, browsable by month, alongside future events.
- Each past event links to its post or page, such as a Facebook post.

**Source:** 9 Nov 14:51–18:01. 10 Nov 17:27–18:00.

#### NAC-14 Opportunities — PHASE 2

**Story:** As a visitor, I want to see NAC's current opportunities, and as a NAC administrator I want to add them myself, so that the list is always up to date.

**Acceptance criteria:**

- Opportunities are added, edited and removed in the back office.
- They appear on the Opportunities page of the site.

**Source:** 10 Nov 8:05–17:27.

### Epic F — Gallery, videos and homepage

#### NAC-15 Photo gallery in albums — PHASE 1

**Story:** As a visitor, I want to browse NAC's photos in albums, and as a NAC administrator I want to add new photos easily, so that the gallery is always current.

**Acceptance criteria:**

- Photos are grouped into albums, for example by project or program (as the old site does, with categories such as Slogba).
- Choosing an album opens a page of its photos, displayed better than today.
- A NAC administrator adds a photo or album in the back office and it appears in the gallery.
- This settles the 9 Nov question of keeping or removing the gallery in favour of keeping it, managed in the back office. NAC to confirm.

**Source:** 9 Nov 18:13–19:55. 10 Nov 2:11–17:27.

#### NAC-16 Video gallery from YouTube — PHASE 1

**Story:** As a visitor, I want to watch NAC's videos on the site, and as a NAC administrator I want to add a video by pasting its YouTube link and a short description about it.

**Acceptance criteria:**

- The video gallery shows NAC's YouTube videos, redesigned to look much better.
- NAC supplies the YouTube links; the team adds them.
- A NAC administrator can add a video link in the back office.

**Source:** 10 Nov 2:11–7:54. 9 Nov 18:13–19:55.

#### NAC-17 High-quality photos — PHASE 1

**Story:** As a visitor, I want photos to look sharp, and as a NAC administrator I want to upload photos without losing quality, so that NAC's work looks professional.

**Acceptance criteria:**

- The original photos were good, but the old site's setup reduced their quality. The new site must not.
- Administrators upload the original; the site creates web-friendly versions automatically, in light but high-quality formats.
- There is no fixed small image size (about 200 by 260 pixels today) that blurs photos.
- The slider, gallery and staff photos look crisp on computers and phones, and pages still load quickly.

**Source:** 9 Nov 26:00–28:12. 10 Nov 2:06–2:21.

#### NAC-18 Keep the homepage slider — PHASE 1

**Story:** As a visitor, I want the sliding banner on the home page to stay, because NAC particularly likes it.

**Acceptance criteria:**

- The slider is kept and redesigned to look better.
- A NAC administrator can change the slides in the back office, with quality as in NAC-17.

**Source:** 9 Nov 48:14–48:22. 10 Nov 1:16–2:11.

#### NAC-19 Homepage background video — PHASE 2

**Story:** As a visitor, I want a short video playing in the background of the home page, so that the site feels alive.

**Acceptance criteria:**

- A background video is added to the home page if it works well on slow connections and phones *(proposed)*.
- It is an idea from the dev team, not a request from NAC, so NAC should approve it.

**Source:** 10 Nov 2:11–7:54.

### Epic G — Back office and content

#### NAC-20 Back office for NAC staff — PHASE 1

**Story:** As a NAC administrator, I want to log in and update every part of the site that changes often, so that the site stays current without a developer.

**Acceptance criteria:**

- Editable sections are: events, opportunities, youth spaces, staff, the gallery (photos and videos) and partners or members. Programs may also be editable (to confirm).
- Each section can be added to, edited and removed.
- The screens are simple enough for non-technical staff, and Patricia confirms the full list of what must be editable.

**Source:** 9 Nov 17:40–18:13 and 24:04–24:53. 10 Nov 2:11–17:27.

#### NAC-21 Manage partners in the back office — PHASE 1

**Story:** As a NAC administrator, I want to add a partner at any time with its logo, link, image and basic information, so that the partner section stays current.

**Acceptance criteria:**

- Each partner record holds a logo, a link to its website, an image and basic information.
- A new or edited partner shows on the site straight away.

**Source:** 10 Nov 21:27–27:55.

#### NAC-22 Hidden admin login — PHASE 1

**Story:** As NAC, I want the admin login to be hidden from the public, so that visitors cannot see or try it.

**Acceptance criteria:**

- The public site shows no login button; the current one is visible to everyone.
- Administrators reach the login at an address known only to them, such as `/login`.
- The login is secure *(proposed)*.

**Source:** 10 Nov 21:27–27:55.

#### NAC-23 Correct logo — PHASE 1

**Story:** As NAC, I want the correct logo shown across the site, so that our brand is shown properly.

**Acceptance criteria:**

- The current logo is replaced with the correct one (the version with the tagline).
- Samuel obtains the correct logo and sends it to the team.
- A NAC administrator can change the logo from the back office *(proposed)*.

**Source:** 9 Nov 47:57–48:14. 10 Nov 0:00–2:11.

#### NAC-24 Load NAC's content and media — PHASE 1

**Story:** As NAC, I want my prepared content and pictures loaded onto the site, so that the pages reflect our current work.

**Acceptance criteria:**

- NAC's content document is added to About us, Programs and the other pages.
- NAC supplies program images, youth space photos from all regions, and the YouTube links.
- NAC reviews the pages before they are shared with partners.

**Source:** 9 Nov 14:51–22:00 and 41:00–41:32. 10 Nov 8:05–17:27.

### Epic H — Insights

#### NAC-25 Visitor analytics — PHASE 2

**Story:** As NAC, I want to know who visits the site, how many visitors there are, when they came and which pages they looked at, so that we understand our audience.

**Acceptance criteria:**

- The site records visitor numbers, visit times and pages viewed.
- NAC can read these figures in a simple report *(proposed)*.

**Source:** 9 Nov 44:00–45:49. 10 Nov 21:27–27:55 (Elijah relayed this from the client).

### Epic I — Platform and engineering

#### NAC-26 Rebuild on Next.js and TypeScript — PHASE 1

**Story:** As a developer, I want the site rebuilt in Next.js and TypeScript, front end and back end, so that iONA can maintain and extend it.

**Acceptance criteria:**

- The site is rebuilt, not converted from PHP.
- The front end and the back end, including the back office, are in Next.js with TypeScript.
- The existing domain is kept.

**Source:** 9 Nov 2:53–14:51. 10 Nov 1:16 and 35:11–37:05.

#### NAC-27 Deploy on Vercel as one project — PHASE 1

**Story:** As a developer, I want the whole site deployed on Vercel from a single repository, so that hosting is simple and low cost.

**Acceptance criteria:**

- The front end and back end live in one monorepo on GitHub.
- The full site, including the back office, is deployed on Vercel.
- The team has used this setup before and learns any part it has not.

**Source:** 10 Nov 21:27–27:55 and 36:14–36:41.

#### NAC-28 Review and migrate existing content — PHASE 1

**Story:** As a developer, I want to review the current back office and database before building, so that useful content is not lost.

**Acceptance criteria:**

- Samuel gets the credentials for the current back office and database and shares them with Lilian.
- Lilian reviews the SQL database (probably MySQL) and the existing admin first.
- Content that should stay is moved to the new site, with nothing lost without NAC's approval.

**Source:** 10 Nov 0:00 and 35:11–40:19. 9 Nov 2:53–14:51.

#### NAC-29 Maintainable code, built with AI — PHASE 1

**Story:** As a developer, I want the code to be well structured and organised, even when AI helps write it, so that anyone can review or change it later.

**Acceptance criteria:**

- The project is organised clearly, with the AI tool guided to write simple, maintainable code.
- Code can be reviewed and changed by a developer who does not use AI.
- A paid AI coding tool for one month is arranged with finance and shared with the team.

**Source:** 10 Nov 29:39–40:19.

#### NAC-30 Security — PHASE 2

**Story:** As NAC, I want the new site protected, so that it does not suffer the hosting and hacking problems of the past.

**Acceptance criteria:**

- Secure hosting that is kept up to date *(proposed)*.
- A protected administrator login *(proposed)*.
- Regular backups *(proposed)*.

**Source:** 9 Nov 24:53–26:00.

#### NAC-31 Better design and picture quality — PHASE 1

**Story:** As a visitor, I want a modern, attractive site with sharp pictures, so that I take NAC seriously as an organisation.

**Acceptance criteria:**

- The design is improved overall, taking cues from DreamTown and aiming to be even better.
- The look is consistent across all pages.
- Picture quality follows NAC-17.

**Source:** 10 Nov 1:16–2:11 and 8:05–17:27. 9 Nov 4:57–7:34.

---

## 5. Action Items

| # | Owner | Action | When |
| --- | --- | --- | --- |
| 1 | Samuel | Email the correct logo and the reference-site document to Elijah, Allan and Lilian. | This week before Sabbath, Nov. 14, 2026 |
| 2 | Samuel | Share this requirements document with Elijah, Allan and Lilian. | Thursday, Nov. 12, 2026 |
| 3 | Samuel | Create the GitHub repository and add Elijah, Allan and Lilian as contributors. | Thursday, Nov. 12, 2026 |
| 4 | Samuel | Talk to finance about one month of Cursor and share access with the team. | Thursday, Nov. 12, 2026 |
| 5 | Samuel | Get the current back-office and database credentials and share them with Lilian. | This week before Sabbath, Nov. 14, 2026 |
| 6 | Lilian | Review the existing back office and SQL database once the credentials arrive. | After action 5 |
| 7 | Allan | Start the project setup. | This week before Sabbath, Nov. 14, 2026 |
| 8 | NAC | Send the YouTube links for the video gallery. | Next Week |
| 9 | NAC | Send the program images and youth space photos from all regions to Samuel. | Not set |
| 10 | Team | Have the site presentable and deployed for review. | 26 November 2026 |

---

## 6. Open Questions

1. **Members or partners:** which name does NAC want for the section, and are they the same organisations?
2. **Youth Spaces:** What should each space page show about them? Which regions group the spaces?
3. Which database does the new site use, given the Vercel deployment?
4. Confirm the AGM date shown as an example (13 November), and the correct logo and name of the partner-showcase site.
5. Does NAC want a homepage background video, and a map for the youth spaces?
