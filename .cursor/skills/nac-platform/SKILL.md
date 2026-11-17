---
name: nac-platform
description: >-
  NAC website monorepo conventions for Vercel deployment, Prisma/env handling,
  and keeping source files under 200 lines. Use when editing this repo, adding
  packages, writing migrations, Auth.js/admin code, or structuring Next.js apps.
---

# NAC platform conventions

## Always keep these true

1. **Vercel-ready monorepo** — one deployable Next.js app (`apps/web`) plus shared packages (`packages/*`). Do not introduce a second production app that needs a separate Vercel project unless the user asks.
2. **Source files under 200 lines** — prefer splitting modules over growing a file. If a change would push a file over ~200 lines, extract helpers, components, or route modules first.
3. **Root `.env` for local secrets** — Both `packages/database` and `apps/web` scripts must load `../../.env` with `dotenv-cli`. Next.js does not automatically read a monorepo-root `.env` when the app lives in `apps/web`. On Vercel, set the same vars in the project dashboard instead of files.
4. **No secrets in git** — never commit `.env`; keep `.env.example` placeholders only. Learning notes under `documentation/learning/` stay gitignored.

## Monorepo / Vercel layout

```text
apps/web          → sole Vercel service (`vercel.json` → services.web)
packages/database → Prisma schema, migrations, client (Dev B)
packages/ui       → shared UI (Dev A)
packages/validation → shared Zod (when added)
apps/docs         → Turborepo starter only — do not deploy
```

Dev A (public UI) and Dev B (admin) share **one** Next.js app and one Hobby deployment. Split is by routes/stories, not by Vercel services.

When adding config for deploy:

- Keep `apps/web` able to import workspace packages (`transpilePackages` / Turborepo).
- Put server-only DB/auth code in packages or `apps/web` server modules that Vercel can bundle.
- Avoid relying on Docker at runtime on Vercel; Docker Compose is **local Postgres only**.
- Use env vars in the Vercel project: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, etc.
- Root `vercel.json` uses Services mode with a single public `web` service; no bindings; no `docs` service.

## File size rule (hard preference)

- Target **≤ 200 lines** per source file (`.ts`, `.tsx`, `.css` modules, etc.).
- Generated files (Prisma migrations, lockfiles, `.next`) are exempt.
- Split by responsibility: `auth.ts` vs `require-admin.ts` vs login UI vs proxy.
- If documenting concepts for learning, put long notes in `documentation/learning/` (gitignored), not in committed story files.

## Prisma migrations

- Generate SQL with Prisma; write migration files as **UTF-8 without BOM**.
- PowerShell `Set-Content -Encoding utf8` can add a BOM and break Postgres (`syntax error at or near ""` / P3006 on shadow DB). Prefer Prisma’s own migrate commands or write with UTF-8 no BOM.
- Load root env: `dotenv -e ../../.env -- prisma …`

## Auth / admin

- Protect `/admin` in `proxy.ts` **and** re-check with `requireAdmin` / `assertAdminSession` on server operations.
- Credentials + JWT session is OK for the single admin; hash passwords with bcrypt; never store plaintext.
- Login must rate-limit failed attempts server-side and use generic errors (see `lib/login-rate-limit.ts`).

## Public data contract (Dev A)

- Public pages must call named helpers from `@repo/database`, never `prisma`. Enforced by ESLint in `apps/web/eslint.config.js` and by `.cursor/rules/public-data-contract.mdc`.
- Contract map: `documentation/user-stories/frontend/00-overview.md`. Do not weaken the ESLint rule to “make a page work” — add a helper in `packages/database` instead.
