import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { loginAction } from "./login-action";
import styles from "./login.module.css";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

function errorMessage(error: string | undefined): string | null {
  if (!error) {
    return null;
  }
  if (error === "TooManyAttempts") {
    return "Too many sign-in attempts. Please try again later.";
  }
  // CredentialsSignin and any other auth error — never reveal which field failed.
  return "Invalid email or password.";
}

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

  const message = errorMessage(params.error);
  const boundLogin = loginAction.bind(null, callbackUrl);

  return (
    <main className={styles.main}>
      <form action={boundLogin} className={styles.card}>
        <h1 className={styles.title}>NAC Admin</h1>
        <p className={styles.hint}>Sign in to manage site content.</p>

        {message ? (
          <p className={styles.error} role="alert">
            {message}
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
