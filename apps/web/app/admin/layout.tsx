import { requireAdmin } from "../../lib/require-admin";
import { logoutAction } from "./logout-action";
import styles from "./admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>NAC Admin</p>
          <p className={styles.user}>
            {session.user.name ?? "Site Admin"} · {session.user.email}
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className={styles.logout}>
            Sign out
          </button>
        </form>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
