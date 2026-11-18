# ISSUE-002 — About Us: mission, vision, what we do, why + images (max 2)

| | |
| --- | --- |
| **Area** | Admin CMS — About Us |
| **Priority** | P1 |
| **Related** | AD-B3-06 / B3-13, FE-E03, rich text (AD-B9-02) |
| **Status** | Open |

## Problem

About Us is a single `PageContent` row (`key: "about"`) with `title` + freeform `body`. NAC needs structured sections:

- Mission  
- Vision  
- What we do  
- Why  

…and **up to 2 images** for the About page.

## Desired behaviour

### Copy

- Admin edits four distinct long-text fields (rich-text conventions via `richText()` / `<RichText>`).
- Optional page title / intro eyebrow if still useful.
- Public About page can render each section with its own heading (Dev A); helpers must expose the fields typed.

### Images

- Upload, alt text, reorder, remove — max **2** images.
- Same media rules as other CMS images (2.5 MB, variants, Blob in production).

## Suggested approach

**Option A (prefer for clarity):** Extend schema — either:

- Dedicated `AboutPage` singleton model with `mission`, `vision`, `whatWeDo`, `why`, plus `AboutPageImage` join; or  
- Four `PageContent` keys (`about.mission`, …) + image join keyed to about.

**Option B:** Store structured JSON in one `PageContent.value` / body — harder to validate and migrate.

Migrate existing `about` body into the most suitable section (e.g. “What we do”) once, without losing seed/admin text.

Update `getPageContent(ABOUT_PAGE_KEY)` (or replace with `getPublishedAboutPage()`) and E03 / frontend data contract.

## Acceptance criteria

- [ ] Admin About form has Mission, Vision, What we do, Why (required rules TBD with NAC; default: all required except maybe Why).
- [ ] Up to 2 images with alt text; third upload rejected clearly.
- [ ] Public helper returns structured fields + images (published/live — About has no draft today; keep “save = live” or introduce draft if required).
- [ ] E03 story + Dev A contract updated.
