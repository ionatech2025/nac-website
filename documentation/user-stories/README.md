# NAC Website — User Stories

Generated from [`NAC_Rebuild_Requirements_Updated.md`](../NAC_Rebuild_Requirements_Updated.md) (Requirements Specification v3).

Stories are split for the two developers:

| Folder | Owner | Scope |
| --- | --- | --- |
| [`frontend/`](frontend/) | **Dev A** — public UI | Epics E1–E15: public pages, layout, forms UI, calendar, galleries, filters, SEO, accessibility |
| [`admin/`](admin/) | **Dev B** — admin portal & server | Epics B1–B9, plus server side of E8/E9/E12/E13, data access, uploads, analytics, migration |

## How to use

1. Start from the folder overview (`00-overview.md`).
2. Work epic files in the suggested sprint order (see requirements §16).
3. Each story has: ID, priority (`P1` / `P2` / `P3`), related requirement IDs, acceptance criteria, and notes.
4. Stories marked **Blocked** wait on open questions in requirements §15.1 — do not implement until decided.
5. Shared (`A+B`) work: agree the data contract first; Dev A builds against seed data and typed data-access; Dev B owns schema and server handlers.

## Actors

| Actor | Description |
| --- | --- |
| Visitor | Anyone browsing the public site. No account. |
| Applicant | Visitor interested in an opportunity; applies **by email outside the site**. |
| Complainant | Visitor submitting a complaint; **must remain anonymous**. |
| Site Admin | Single NAC administrator for all content, inquiries and complaints. |
| iONA Technical Team | Builds and maintains the system; does not manage content. |

## Working agreements (from requirements §3)

1. Database schema is owned by Dev B — see [`../database-schema.md`](../database-schema.md) and [`../../packages/database/prisma/schema.prisma`](../../packages/database/prisma/schema.prisma).
2. Sprint 0 is shared: route groups `(public)` / `admin`, ORM schema, seed data, shared validation, CI.
3. Server is authoritative for validation and authorisation.
4. Public forms: Dev A builds UI; Dev B builds handler and storage.
