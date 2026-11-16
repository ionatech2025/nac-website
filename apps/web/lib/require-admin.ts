import { redirect } from "next/navigation";
import { auth } from "../auth";

/**
 * Server-side gate for admin pages and Server Actions.
 * Proxy redirects browsers; this enforces authorisation on every protected operation.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

export async function assertAdminSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}
