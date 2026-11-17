"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon } from "../../../lib/admin-icons";
import { ADMIN_NAV_GROUPS } from "../../../lib/admin-nav";
import styles from "../admin-shell.module.css";
import badgeStyles from "./nav-badge.module.css";

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({
  badges = {},
}: {
  badges?: Record<string, number>;
}) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Admin">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.label} className={styles.navGroup}>
          <p className={styles.navGroupLabel}>{group.label}</p>
          <ul className={styles.navList}>
            {group.links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      active
                        ? `${styles.navLink} ${styles.navLinkActive}`
                        : styles.navLink
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    <AdminIcon name={link.icon} className={styles.navIcon} />
                    <span>{link.label}</span>
                    {badges[link.href] ? (
                      <span className={badgeStyles.badge}>
                        {badges[link.href]! > 99 ? "99+" : badges[link.href]}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
