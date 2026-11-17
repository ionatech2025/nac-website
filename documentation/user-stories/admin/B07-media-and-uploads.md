# B7 — Media and file uploads

## AD-B7-01 PDF upload with 2.5 MB cap

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B7-01, E11-04 |

**As the** Site Admin,  
**I want** PDF uploads rejected above 2.5 MB on client and server with a clear message,  
**so that** Hobby request limits are respected and visitors get workable files.

### Acceptance criteria

- [x] Client and server both enforce max **2.5 MB** (`2_621_440` bytes) for PDFs. *(input `accept` + `savePdfUpload`)*
- [x] Clear error when limit exceeded. *(redirect `?error=pdf-size`)*
- [x] Prefer direct-to-storage upload if body size risk remains. *(Vercel Blob when token set; else local `public/uploads`)*

---

## AD-B7-02 Image uploads and validation

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B7-02, B7-03 |
| **Note** | Q10 decided: **2.5 MB** for images as well as PDFs.

**As the** Site Admin,  
**I want** to upload JPEG/PNG/WebP images with type validation, a 2.5 MB cap, and compression/resize,  
**so that** galleries and cards stay sharp without huge payloads.

### Acceptance criteria

- [x] Allowed image types only; validate by content, not extension alone. *(team photo via `save-image-upload.ts` magic-byte sniff)*
- [x] Large images resized/compressed before or during upload. *(during: sharp renders 480px `thumb` + 1280px `medium` WebP variants; the original is kept as the master — see AD-B7-03)*
- [x] Enforce max **2.5 MB** for images (same as PDFs). *(shared `MAX_UPLOAD_BYTES`)*

---

## AD-B7-03 Object storage and stable URLs

| | |
| --- | --- |
| **Priority** | P1 / P2 |
| **Requirements** | B7-04, B7-05, B7-06 |

**As the** Site Admin,  
**I want** files stored in object storage with metadata in the database, stable public URLs when replacing documents, and thumbnails for cards/galleries,  
**so that** media is durable and pages stay fast.

### Acceptance criteria

- [x] Files in object storage; DB holds metadata + URL only. *(`lib/storage.ts`: Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, `public/uploads` in local dev; `MediaAsset` stores url, key, name, type, size, dimensions)*
- [x] Replacing a document keeps the public URL working (P2). *(`/downloads/<documentId>` redirects to the current file and counts human downloads; the old PDF is deleted on replace; admin form shows the link)*
- [x] Thumbnails/variants generated for gallery and cards (P2). *(`thumbUrl` / `mediumUrl` on `MediaAsset`; `mediaVariantUrl()` + `PUBLIC_IMAGE_SELECT` in `@repo/database` for Dev A; admin album grids use thumbs)*
- [x] Storage accounts are NAC-owned, administered by iONA. *(no separate account: the Blob store is created inside the same Vercel Hobby project as the site and database, so it is owned by whoever owns that project. Free on Hobby — 1 GB storage, 10 GB transfer, 2,000 writes/month — and Hobby never bills; over the limit, Blob pauses until the 30-day window resets)*

### Implementation notes

- Unused media is cleaned up two ways: immediately when a document PDF, album photo or opportunity attachment is replaced/removed, and by a daily cron (`/api/cron/media-cleanup`, 24 h grace) that sweeps anything no row references — e.g. a replaced team photo.
- Deletion always re-checks every `MediaAsset` relation first, because optional relations default to `SET NULL` and would silently blank an image elsewhere.
- Assets uploaded before this change have no variants; `mediaVariantUrl()` falls back to the original.
- Hobby budget: each image upload is 3 writes (original + 2 variants), each PDF 1 write — roughly 600 image uploads a month within the free 2,000 writes. Deletes are free. Uploads are capped at 2.5 MB, so 1 GB holds several hundred photos with their variants.
