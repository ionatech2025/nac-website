"use client";

import Link from "next/link";
import { isNavActive, type NavColumn } from "@/lib/navigation";
import styles from "./nav-mega-panel.module.css";

type Props = {
  overviewHref: string;
  overviewLabel?: string;
  columns: NavColumn[];
  pathname: string;
  open: boolean;
  id: string;
};

export function NavMegaPanel({
  overviewHref,
  overviewLabel = "All youth spaces",
  columns,
  pathname,
  open,
  id,
}: Props) {
  return (
    <div
      id={id}
      className={open ? `${styles.mega} ${styles.megaOpen}` : styles.mega}
      data-nav-mega
      hidden={!open}
    >
      <Link href={overviewHref} className={styles.megaAll}>
        {overviewLabel}
      </Link>
      <div className={styles.megaColumns}>
        {columns.map((column) => (
          <div key={column.heading} className={styles.megaColumn}>
            <Link href={column.href} className={styles.megaHeading}>
              {column.heading}
            </Link>
            <ul className={styles.megaList}>
              {column.children.map((child) => {
                const active = isNavActive(pathname, child.href);
                return (
                  <li key={child.href}>
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
          </div>
        ))}
      </div>
    </div>
  );
}
