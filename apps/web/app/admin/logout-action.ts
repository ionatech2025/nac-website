"use server";

import { signOut } from "../../auth";

/** Clears the Auth.js session cookie and returns the admin to /login. */
export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
