# ISSUE-003 — Server Action body limit blocks PDFs up to 2.5 MB (P0)

| | |
| --- | --- |
| **Area** | Admin uploads — Documents (and any multipart Server Action) |
| **Priority** | **P0** (production + local) |
| **Related** | B7-01 / Q10 (2.5 MB cap), AD-B3-02 Downloads |
| **Status** | Done |

## Problem

Uploading a PDF on **New download** fails before our validation runs:

```text
Error: Body exceeded 1 MB limit.
To configure the body size limit for Server Actions, see:
https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit
statusCode: 413
```

Seen on **Vercel production** and **local Next.js 16.3.8 (Turbopack)** on `DocumentForm` → `<form action={…}>`.

Our app allows **2.5 MB** (`MAX_UPLOAD_BYTES = 2_621_440`) for PDFs and images. Next.js Server Actions default body limit is **1 MB**, so any file between ~1 MB and 2.5 MB is rejected by the framework with 413 — including many real PDFs and photos (and worse: image uploads that also send thumb+medium variants still go through the same action with the original file in `FormData`).

## Desired behaviour

- Server Actions that accept file uploads allow at least **2.5 MB** (match `MAX_UPLOAD_BYTES`), with a small overhead for other form fields (e.g. **3 MB** body limit).
- Oversized files still fail via our Zod / `savePdfUpload` / `saveImageUpload` messages, not an opaque Next 413.
- Applies to documents, team photos, albums, youth spaces, programmes (once galleries land), etc. — any `encType`/multipart Server Action.

## Suggested approach

In `apps/web/next.config.js` — must be under **`experimental.serverActions`** (Next 16 still keeps this option experimental; a top-level `serverActions` key is ignored and the 1 MB default remains):

```js
experimental: {
  serverActions: {
    bodySizeLimit: "3mb", // ≥ MAX_UPLOAD_BYTES + form field overhead
  },
},
```

See [Next.js `serverActions.bodySizeLimit`](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions#bodysizelimit).

Optional follow-ups (not required to close P0):

- Client-side size check before submit (already partially via UX hints).
- Direct-to-Blob client uploads for very large files later (Hobby still capped at 2.5 MB by product rule).

## Acceptance criteria

- [x] `next.config.js` sets Server Action body limit ≥ 2.5 MB (+ margin).
- [ ] Local: upload a ~2 MB PDF on `/admin/documents/new` succeeds (or fails only on our type/size rules).
- [ ] Production (after deploy): same PDF upload works with Blob configured.
- [x] Sub‑1 MB uploads still work; files over 2.5 MB still get our clear size error.
- [x] Note added to deploy/learning checklist if useful.

## Notes from logs

- Digest example: `2258341447@E394` (Vercel).
- Stack points at Server Action body parsing, not Prisma or Blob — fixing Blob alone does not fix this.
