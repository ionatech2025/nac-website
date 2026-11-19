# B1 — Authentication (single admin)

## Prerequisite (Sprint 0)

Before full login UX (Sprint 1), Sprint 0 delivers: Postgres + Prisma client, seed `AdminUser`, Auth.js credentials skeleton, hidden `/login`, and `/admin` route protection. **AD-B1-01** is the first story to implement once that skeleton is in place (this repo now starts there).

## Concepts (local study notes)

Detailed learner notes live in **`documentation/learning/auth-concepts.md`** (gitignored — not pushed). Use that file as your reference while working through AD-B1-01–05.

---

## AD-B1-01 Protect admin portal with one account

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B1-01, B1-04 |

**As the** Site Admin,  
**I want** to sign in so that only I can access `/admin` pages and admin actions,  
**so that** the public cannot change content or read inquiries/complaints.

### Acceptance criteria

- [x] All `/admin` pages require an authenticated session. *(Sprint 0 skeleton: `proxy.ts` + `requireAdmin`)*
- [x] All admin server actions/route handlers enforce auth on the server (not only by hiding UI). *(use `requireAdmin()` in handlers)*
- [x] Unauthenticated users cannot call admin operations (journey 13).

**Status:** Done — continue hardening with AD-B1-02/03.

---

## AD-B1-02 Secure sessions and logout

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B1-02 |

**As the** Site Admin,  
**I want** secure password hashing, HTTP-only cookies, session expiry and logout,  
**so that** my session is not easily stolen or left open.

### Acceptance criteria

- [x] Passwords stored hashed (modern algorithm). *(bcrypt cost 12 in seed; `passwordHash` only in DB)*
- [x] Session cookie is HTTP-only, Secure in production, appropriately SameSite. *(`lib/session-security.ts`)*
- [x] Sessions expire; logout clears the session. *(8h JWT `maxAge`; admin **Sign out** → `signOut`)*

**Status:** Done.

---

## AD-B1-03 Login rate limiting

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B1-03 |

**As the** iONA Technical Team,  
**I want** login rate limiting and generic error messages,  
**so that** attackers cannot easily brute-force or enumerate accounts.

### Acceptance criteria

- [x] Repeated failed logins are rate limited. *(5 failures / 10 min → 15 min lock; `lib/login-rate-limit.ts`)*
- [x] Error messages do not reveal whether email/username exists. *(generic copy + dummy bcrypt when email missing)*

**Status:** Done — in-memory limiter for v1; shared store (Redis) later if multi-instance needs it.

---

## AD-B1-06 Change email and password while signed in

| | |
| --- | --- |
| **Priority** | P1 |
| **Status** | Done |

**As the** Site Admin,  
**I want** to change my email and password from `/admin/account`,  
**so that** I can rotate credentials without developer help.

### Acceptance criteria

- [x] Current password required for email and password changes.
- [x] New password min 10 characters; confirmation must match.
- [x] Email change signs the admin out so the next login uses the new address.
- [x] Password hashed with bcrypt (cost 12).

---

## AD-B1-04 Password recovery via email

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B1-05 |
| **Status** | Ready — Q7 decided (email reset) |

**As the** Site Admin,  
**I want** to reset my password by email if I am locked out,  
**so that** a single admin account is not a permanent lockout.

### Acceptance criteria

- [ ] Email-based password reset is implemented for the admin account.
- [ ] Reset tokens expire; links are single-use.
- [ ] Credentials and mailbox remain under NAC-owned control.

---

## AD-B1-05 Role field for future expansion

| | |
| --- | --- |
| **Priority** | P3 |
| **Requirements** | B1-07 |

**As a** developer,  
**I want** a `role` field on the admin user (default `admin`),  
**so that** more users/roles can be added later without redesign.

### Acceptance criteria

- [x] Data model includes `role`; v1 still uses a single admin account. *(Prisma `AdminUser.role` / `AdminRole`)*
- [x] MFA (B1-06) remains out of v1 unless later prioritised.
