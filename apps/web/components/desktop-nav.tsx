"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isNavActive, type NavItem } from "@/lib/navigation";
import { NavMegaPanel } from "./nav-mega-panel";
import styles from "./desktop-nav.module.css";

type Props = {
  items: NavItem[];
};

function MegaGroup({
  item,
  pathname,
}: {
  item: Extract<NavItem, { type: "group" }>;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const panelId = useId();
  const columns = item.columns ?? [];
  const groupActive =
    isNavActive(pathname, item.href) ||
    item.children.some((child) => isNavActive(pathname, child.href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <li ref={rootRef} className={styles.group}>
      <button
        type="button"
        className={groupActive ? styles.activeTrigger : styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        {item.label}
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>
      <NavMegaPanel
        id={panelId}
        overviewHref={item.href}
        columns={columns}
        pathname={pathname}
        open={open}
      />
    </li>
  );
}

function SimpleGroup({
  item,
  pathname,
}: {
  item: Extract<NavItem, { type: "group" }>;
  pathname: string;
}) {
  const groupActive =
    isNavActive(pathname, item.href) ||
    item.children.some((child) => isNavActive(pathname, child.href));

  return (
    <li className={styles.group}>
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
      <ul
        className={
          item.layout === "horizontal"
            ? styles.dropdownHorizontal
            : styles.dropdown
        }
      >
        {item.children.map((child) => {
          const active = isNavActive(pathname, child.href, {
            exact: child.href === item.href,
          });
          return (
            <li key={`${child.href}-${child.label}`}>
              <Link
                href={child.href}
                className={active ? styles.activeDropLink : styles.dropLink}
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
}

export function DesktopNav({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Primary">
      <ul className={styles.list}>
        {items.map((item) => {
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

          if (item.columns && item.columns.length > 0) {
            return (
              <MegaGroup key={item.label} item={item} pathname={pathname} />
            );
          }

          return (
            <SimpleGroup key={item.label} item={item} pathname={pathname} />
          );
        })}
      </ul>
    </nav>
  );
}
