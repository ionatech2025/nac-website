# E4 — Staff directory

## Server contract (Dev B)

When CMS reads are wired, swap seed helpers in `apps/web/lib/staff-data.ts` for:

```ts
import { listPublishedTeamMembers } from "@repo/database";

const members = await listPublishedTeamMembers();
// { id, name, roleTitle, biography, photo }
```

**Dev A (this epic):** public Staff UI uses seed/fallback data only — no Prisma / `DATABASE_URL`.

---

## FE-E4-01 Staff listing

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | E4-01, E4-02 |
| **Depends on** | Dev B published team members query |

**As a** visitor,  
**I want** a staff directory with name, role and optional photo in admin-defined order,  
**so that** I know who works at NAC.

### Acceptance criteria

- [x] Lists only published staff.
- [x] Shows name, role and photo when available.
- [x] Order matches admin sort order.
- [x] Empty/loading/error states exist.

---

## FE-E4-02 Optional staff biography

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | E4-03 |

**As a** visitor,  
**I want** to read a short biography when NAC has supplied one,  
**so that** I learn more about a staff member.

### Acceptance criteria

- [x] Biography shows only when provided.
- [x] No invented biographies; missing bio is simply omitted.
