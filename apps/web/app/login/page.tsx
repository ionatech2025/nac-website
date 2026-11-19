import { Plus_Jakarta_Sans } from "next/font/google";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { loginAction } from "./login-action";
import { PasswordField } from "./password-field";
import styles from "./login.module.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});


type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string; notice?: string }>;
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

function noticeMessage(notice: string | undefined): string | null {
  if (notice === "EmailChanged") {
    return "Email updated. Sign in with your new email.";
  }
  return null;
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
  const notice = noticeMessage(params.notice);
  const boundLogin = loginAction.bind(null, callbackUrl);

  return (
    <main className={`${styles.main} ${plusJakarta.variable}`}>
      <form action={boundLogin} className={styles.card}>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/nac-logo.png"
          alt="Network for Active Citizens"
          className={styles.logo}
        />
        <h1 className={styles.title}>NAC ADMIN</h1>
        <p className={styles.hint}>Sign in to manage site content.</p>

        {notice ? (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        ) : null}

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

        <PasswordField />

        <button type="submit" className={styles.button}>
          Sign in
        </button>
      </form>
    </main>
  );
}
