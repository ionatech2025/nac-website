# ISSUE-001 — Programme gallery images (max 3)

| | |
| --- | --- |
| **Area** | Admin CMS — Programmes |
| **Priority** | P1 |
| **Related** | AD-B3-06, B07 uploads, FE-E05 |
| **Status** | Done |

## Problem

Each programme can only point at a single optional `imageId` (`Programme.image` → `MediaAsset`). NAC needs **up to three photos** per programme (gallery / card visuals), similar to youth spaces (max 5) and albums.

## Desired behaviour

- Admin can upload, caption/alt, reorder, and remove programme photos.
- Hard cap: **3** images per programme (reject further uploads with a clear message).
- First image (by sort order) is the card/cover image for public list views.
- JPEG/PNG/WebP, ≤ 2.5 MB each; thumbnails via existing `saveImageUpload` / variants.
- Removed images cleaned up via `deleteMediaIfUnused` (B07).

## Suggested approach

1. Add `ProgrammeImage` (or reuse a shared join) mirroring `YouthSpaceImage`: `programmeId`, `mediaId`, `caption?`, `sortOrder`.
2. Keep or drop `Programme.imageId` — prefer deriving cover from first gallery image to avoid two sources of truth.
3. Admin UI: photo panel on programme edit (pattern: `youth-spaces/space-photos.tsx` / album images).
4. Public helpers: include ordered images (or first only on list) in `listPublishedProgrammes` / `getPublishedProgrammeBySlug`; document in E05 + frontend data contract.

## Acceptance criteria

- [x] Admin can attach 1–3 images on create/edit programme.
- [x] Fourth upload is rejected with a clear error.
- [x] Publish/unpublish unchanged; drafts never leak via public helpers.
- [x] E05 server contract updated for Dev A.
