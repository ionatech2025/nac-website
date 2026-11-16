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

- [ ] Client and server both enforce max **2.5 MB** (`2_621_440` bytes) for PDFs.
- [ ] Clear error when limit exceeded.
- [ ] Prefer direct-to-storage upload if body size risk remains.

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

- [ ] Allowed image types only; validate by content, not extension alone.
- [ ] Large images resized/compressed before or during upload.
- [ ] Enforce max **2.5 MB** for images (same as PDFs).

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

- [ ] Files in object storage; DB holds metadata + URL only.
- [ ] Replacing a document keeps the public URL working (P2).
- [ ] Thumbnails/variants generated for gallery and cards (P2).
- [ ] Storage accounts are NAC-owned, administered by iONA.
