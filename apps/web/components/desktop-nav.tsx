"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { isNavActive, type NavItem } from "@/lib/navigation";
import { NavMegaPanel } from "./nav-mega-panel";
import styles from "./desktop-nav.module.css";

type Props = {
  items: NavItem[];
};

type GroupItem = Extract<NavItem, { type: "group" }>;

function useOutsideClose(
  open: boolean,
  rootRef: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onCloseRef.current();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rootRef]);
}

function MegaGroup({
  item,
  pathname,
  open,
  onToggle,
  onClose,
}: {
  item: GroupItem;
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLLIElement>(null);
  const panelId = useId();
  const columns = item.columns ?? [];
  const groupActive =
    isNavActive(pathname, item.href) ||
    item.children.some((child) => isNavActive(pathname, child.href));

  useOutsideClose(open, rootRef, onClose);

  return (
    <li ref={rootRef} className={styles.group}>
      <button
        type="button"
        className={groupActive ? styles.activeTrigger : styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={onToggle}
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
  open,
  onToggle,
  onClose,
}: {
  item: GroupItem;
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLLIElement>(null);
  const panelId = useId();
  const groupActive =
    isNavActive(pathname, item.href) ||
    item.children.some((child) => isNavActive(pathname, child.href));

  useOutsideClose(open, rootRef, onClose);

  return (
    <li ref={rootRef} className={styles.group}>
      <button
        type="button"
        className={groupActive ? styles.activeTrigger : styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {item.label}
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>
      <ul
        id={panelId}
        hidden={!open}
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
                onClick={onClose}
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
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const close = useCallback(() => setOpenLabel(null), []);

  useEffect(() => {
    setOpenLabel(null);
  }, [pathname]);

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
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const open = openLabel === item.label;
          const onToggle = () =>
            setOpenLabel((current) =>
              current === item.label ? null : item.label,
            );

          if (item.columns && item.columns.length > 0) {
            return (
              <MegaGroup
                key={item.label}
                item={item}
                pathname={pathname}
                open={open}
                onToggle={onToggle}
                onClose={close}
              />
            );
          }

          return (
            <SimpleGroup
              key={item.label}
              item={item}
              pathname={pathname}
              open={open}
              onToggle={onToggle}
              onClose={close}
            />
          );
        })}
      </ul>
    </nav>
  );
}
