"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, primaryNav } from "@/lib/navigation";
import styles from "./desktop-nav.module.css";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        {primaryNav.map((item) => {
          if (item.type === "link") {
            const active = isNavActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={active ? styles.activeLink : styles.link}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const groupActive =
            isNavActive(pathname, item.href) ||
            item.children.some((child) => isNavActive(pathname, child.href));

          return (
            <li key={item.label} className={styles.group}>
              <Link
                href={item.href}
                className={groupActive ? styles.activeTrigger : styles.trigger}
                aria-haspopup="true"
              >
                {item.label}
                <span className={styles.chevron} aria-hidden="true">
                  ▾
                </span>
              </Link>
              <ul className={styles.dropdown}>
                {item.children.map((child) => {
                  // Index links like "All programmes" share the group href —
                  // match exactly so child routes don't keep them selected.
                  const active = isNavActive(pathname, child.href, {
                    exact: child.href === item.href,
                  });
                  return (
                    <li key={`${child.href}-${child.label}`}>
                      <Link
                        href={child.href}
                        className={
                          active ? styles.activeDropLink : styles.dropLink
                        }
                        aria-current={active ? "page" : undefined}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
