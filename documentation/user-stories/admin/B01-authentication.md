# B1 — Authentication (single admin)

## AD-B1-01 Protect admin portal with one account

| | |
| --- | --- |
| **Priority** | P1 |
| **Requirements** | B1-01, B1-04 |

**As the** Site Admin,  
**I want** to sign in so that only I can access `/admin` pages and admin actions,  
**so that** the public cannot change content or read inquiries/complaints.

### Acceptance criteria

- [ ] All `/admin` pages require an authenticated session.
- [ ] All admin server actions/route handlers enforce auth on the server (not only by hiding UI).
- [ ] Unauthenticated users cannot call admin operations (journey 13).

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

- [ ] Passwords stored hashed (modern algorithm).
- [ ] Session cookie is HTTP-only, Secure in production, appropriately SameSite.
- [ ] Sessions expire; logout clears the session.

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

- [ ] Repeated failed logins are rate limited.
- [ ] Error messages do not reveal whether email/username exists.

---

## AD-B1-04 Password recovery — partially blocked

| | |
| --- | --- |
| **Priority** | P2 |
| **Requirements** | B1-05 |
| **Status** | **Blocked on approach** — open question Q7 |

**As the** iONA team / Site Admin,  
**I want** a documented recovery path if the admin is locked out,  
**so that** a single account is not a permanent lockout.

### Acceptance criteria (once Q7 decided)

- [ ] Either email reset **or** documented iONA-assisted reset is implemented.
- [ ] Recovery credentials remain NAC-owned.

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

- [ ] Data model includes `role`; v1 still uses a single admin account.
- [ ] MFA (B1-06) remains out of v1 unless later prioritised.
