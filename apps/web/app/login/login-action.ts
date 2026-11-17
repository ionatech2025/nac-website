"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "../../auth";
import { getClientIp } from "../../lib/client-ip";
import {
  clearFailedLogins,
  isLoginRateLimited,
  loginAttemptKey,
  recordFailedLogin,
} from "../../lib/login-rate-limit";

export async function loginAction(
  callbackUrl: string,
  formData: FormData,
): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const key = loginAttemptKey(await getClientIp(), email);

  if (isLoginRateLimited(key)) {
    redirect("/login?error=TooManyAttempts");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl.startsWith("/admin") ? callbackUrl : "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      recordFailedLogin(key);
      redirect("/login?error=CredentialsSignin");
    }

    // Successful signIn throws a Next.js redirect — clear the bucket first.
    clearFailedLogins(key);
    throw error;
  }
}
