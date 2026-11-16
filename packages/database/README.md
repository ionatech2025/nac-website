# `@repo/database`

PostgreSQL + Prisma schema for the NAC website rebuild.

- **Human guide:** [`documentation/database-schema.md`](../../documentation/database-schema.md)
- **Schema file:** [`prisma/schema.prisma`](prisma/schema.prisma)
- **Owner:** Dev B. Dev A uses typed data-access helpers only (to be added after Sprint 0).

## Setup

1. Provide `DATABASE_URL` in the environment (NAC-owned Postgres when available).
2. From repo root: `npm install`
3. From this package:

```sh
npm run db:validate
npm run db:generate
```

Migrations and seed scripts are Sprint 0 work for Dev B.
