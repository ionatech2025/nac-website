import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "../../auth";
import styles from "./login.module.css";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl && params.callbackUrl.startsWith("/admin")
      ? params.callbackUrl
      : "/admin";

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=CredentialsSignin");
      }
      throw error;
    }
  }

  return (
    <main className={styles.main}>
      <form action={loginAction} className={styles.card}>
        <h1 className={styles.title}>NAC Admin</h1>
        <p className={styles.hint}>Sign in to manage site content.</p>

        {params.error ? (
          <p className={styles.error} role="alert">
            Invalid email or password.
          </p>
        ) : null}

        <label className={styles.label} htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label} htmlFor="password">
          Password
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button}>
          Sign in
        </button>
      </form>
    </main>
  );
}
