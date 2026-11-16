# `@repo/database`

PostgreSQL + Prisma schema for the NAC website rebuild.

- **Human guide:** [`documentation/database-schema.md`](../../documentation/database-schema.md)
- **Schema file:** [`prisma/schema.prisma`](prisma/schema.prisma)
- **Owner:** Dev B. Dev A uses typed data-access helpers only.

## Setup

1. Copy root `.env.example` to **repo root** `.env` and set `DATABASE_URL`, `AUTH_SECRET`, and admin seed credentials.
2. Start Postgres: `docker compose up -d` from the repo root.
3. From the repo root (workspace scripts load the **root** `.env` via `dotenv-cli`):

```sh
npm run db:generate --workspace=@repo/database
npm run db:migrate:dev --workspace=@repo/database -- --name init
npm run db:seed --workspace=@repo/database
```

Prisma does not automatically read a monorepo root `.env` when the schema lives under `packages/database`. The scripts pass `-e ../../.env` for that reason.

`db:seed` upserts the single `AdminUser` (with `role=ADMIN`) used by Auth.js credentials login.
