import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { prisma } from "@repo/database";
import { requireAdmin } from "../../lib/require-admin";
import { AdminSidebarNav } from "./_components/admin-sidebar-nav";
import { AdminTopbar } from "./_components/admin-topbar";
import { logoutAction } from "./logout-action";
import styles from "./admin-shell.module.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const name = session.user.name ?? "Site Admin";
  const [unreadInquiries, newComplaints] = await Promise.all([
    prisma.inquiry.count({ where: { isRead: false, isArchived: false } }),
    prisma.complaint.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className={`${styles.shell} ${plusJakarta.variable}`}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand} aria-label="NAC Admin home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/nac-logo.png"
            alt="Network for Active Citizens"
            className={styles.brandLogo}
          />
        </Link>
        <AdminSidebarNav
          badges={{
            "/admin/inquiries": unreadInquiries,
            "/admin/complaints": newComplaints,
          }}
        />
        <div className={styles.userRow}>
          <span className={styles.avatar} aria-hidden>
            {initials(name)}
          </span>
          <span className={styles.userText}>
            <span className={styles.userName}>{name}</span>
            <span className={styles.userEmail}>{session.user.email}</span>
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className={styles.logout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} aria-hidden />
            </button>
          </form>
        </div>
      </aside>
      <div className={styles.workspace}>
        <AdminTopbar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
