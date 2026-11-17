/**
 * AD-B1-02 session/cookie policy for Auth.js.
 * Auth.js defaults already use HttpOnly + SameSite=Lax; we pin them explicitly
 * and enable Secure (+ __Secure- prefix) only in production (HTTPS).
 */

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

const isProd = process.env.NODE_ENV === "production";

export const authSessionOptions = {
  strategy: "jwt" as const,
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export const useSecureCookies = isProd;

export const sessionTokenCookie = {
  name: isProd ? "__Secure-authjs.session-token" : "authjs.session-token",
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: isProd,
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
};
