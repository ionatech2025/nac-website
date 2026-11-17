<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# NAC public UI (Dev A)

- **Data contract:** `documentation/user-stories/frontend/00-overview.md` (helper table). Stories under `documentation/user-stories/frontend/E*.md` have **Server contract** blocks when the API is ready.
- **Never** `import { prisma } from "@repo/database"` in public pages — ESLint will fail. Use named `listPublished…` / `getPublished…` / `getPublicSiteSettings` helpers only.
- Long text → `<RichText>` from `lib/rich-text-view.tsx`. No `dangerouslySetInnerHTML`.
- Cursor also loads `.cursor/rules/public-data-contract.mdc` on every chat.
