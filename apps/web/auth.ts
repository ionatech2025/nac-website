import "./auth.config";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@repo/database";
import {
  authSessionOptions,
  sessionTokenCookie,
  useSecureCookies,
} from "./lib/session-security";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Must be set (AUTH_SECRET). Local monorepo: load root .env via `dotenv -e ../../.env` in npm scripts.
  secret: process.env.AUTH_SECRET,
  useSecureCookies,
  cookies: {
    sessionToken: sessionTokenCookie,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        // Dummy hash keeps compare time similar when the email is unknown (anti-enumeration).
        const hash =
          admin?.passwordHash ??
          "$2b$12$hOlXq0BsYiSQM3rqvQeezO/hRWwPsvisoNDdwRfHi23lfDhGrDDeC";
        const valid = await compare(parsed.data.password, hash);
        if (!admin || !valid) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      },
    }),
  ],
  session: authSessionOptions,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "ADMIN";
      }
      return session;
    },
  },
  trustHost: true,
});
