# NAC Website

Rebuilt website for **Network for Active Citizens (NAC)** — a network of youth organisations in Uganda — by iONA Tech.

The current Drupal/PHP site will not be converted. This repo rebuilds the public site and a staff back office on iONA’s stack so NAC can present its work clearly to partners and funders.

Full requirements and user stories: [`documentation/NAC_Website_Requirements_and_User_Stories.md`](documentation/NAC_Website_Requirements_and_User_Stories.md)

---

## Goal

- Show who NAC is and what it does (network positioning, results, programs).
- Add **Youth Spaces** (~15 spaces, by region) and a richer **Members / Partners** directory.
- Keep and improve existing sections: Home, About us, Programs, Opportunities, Events, Gallery, Videos, Staff, Partners.
- Deliver a living events calendar, sharper media, and a back office NAC staff can use without a developer.

**Client presentation target:** from 1 December 2026  
**iONA Phase 1 internal deadline:** 26 November 2026

---

## Stack

| Area | Choice |
| --- | --- |
| Apps | Next.js + TypeScript (public site and back office) |
| Repo | Turborepo monorepo (npm workspaces) |
| Hosting | Vercel (single project) |
| Database | TBD after review of the existing Drupal SQL (likely MySQL); must work with Vercel |

Design cues: [DreamTown](https://dreamtown.org) (especially spaces / “where we work” and menus), plus NAC’s current information architecture and homepage slider.

---

## Team

| Person                           | Focus                                                                      |
| -------------------------------- | -------------------------------------------------------------------------- |
| Samuel Katongole & Elijah Nyombi | Requirements, NAC contact, credentials, logo, GitHub, tooling access       |
| Allan Baliddawa                  | Project start, frontend                                                    |
| Lilian Nankunda                  | Back office and backend; reviews existing admin/DB once credentials arrive |


## Delivery phases

### Phase 1 — Presentable site (by 26 Nov 2026)

Navigation and existing sections, Youth Spaces menu/pages (grouped by region), members/partners directory, programs, events calendar (upcoming + past), photo albums, YouTube video gallery, homepage slider, high-quality images, hidden admin login, and a usable back office for frequently changing content.

### Phase 2 — After Phase 1

Member filters/detail pages, space map and coaches, opportunities CMS polish, homepage background video (if approved), visitor analytics, security hardening.

---

## Repository structure

```text
nac_website/
├── apps/
│   ├── web/          # Public Next.js site (port 3000)
│   └── docs/         # Second Next.js app from the Turborepo starter (to be adapted or replaced for admin/docs as needed)
├── packages/
│   ├── ui/                 # Shared React components
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
├── documentation/          # Requirements and source PDF
└── package.json
```

Each app/package is TypeScript. Shared UI lives in `@repo/ui`.

---

## Getting started

**Requirements:** Node.js `>= 24`, npm `10.9.x` (see root `package.json`).

```sh
npm install
npm run dev
```

Useful filters:

```sh
npx turbo dev --filter=web
npx turbo build --filter=web
```

### Scripts (repo root)

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start all apps in development |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint the monorepo |
| `npm run check-types` | Type-check across workspaces |
| `npm run format` | Format with Prettier |

---

## Site sections (Phase 1)

Public navigation should cover:

- Home (slider; network story and key facts)
- About us
- Programs
- Youth Spaces (dropdown by region → space pages)
- Members / Partners (directory with write-ups; naming TBD with NAC)
- Opportunities
- Events (calendar)
- Gallery (albums) and Videos (YouTube links)
- Staff

Back office (hidden login, e.g. `/login`) should let NAC manage events, opportunities, youth spaces, staff, gallery, videos, and partners/members without developer help.

---

## Documentation and open questions

- Requirements & user stories: [`documentation/NAC_Website_Requirements_and_User_Stories.md`](documentation/NAC_Website_Requirements_and_User_Stories.md)
- Source PDF: [`documentation/NAC_Website_Requirements_and_User_Stories.pdf`](documentation/NAC_Website_Requirements_and_User_Stories.pdf)

Still open with NAC (see the doc): Members vs Partners naming, Youth Space page fields/regions, production database on Vercel, AGM example date, logo/assets, whether to ship homepage background video and a spaces map.

---

## Code quality

Prefer clear structure over cleverness. AI may assist, but the code must stay reviewable and maintainable by a developer who is not using AI.
