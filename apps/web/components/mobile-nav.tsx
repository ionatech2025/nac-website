"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isNavActive, primaryNav } from "@/lib/navigation";
import styles from "./mobile-nav.module.css";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const panel = document.getElementById(panelId);
      if (!panel) return;

      const focusable = [
        ...panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, panelId]);

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        Menu
      </button>

      {open ? (
        <div className={styles.overlay}>
          <div
            className={styles.backdrop}
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className={styles.panelHead}>
              <p className={styles.panelTitle}>Explore NAC</p>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <nav aria-label="Mobile primary">
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

                  return (
                    <li key={item.label} className={styles.group}>
                      <p className={styles.groupLabel}>{item.label}</p>
                      <ul className={styles.sublist}>
                        {item.children.map((child) => {
                          const active = isNavActive(pathname, child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={
                                  active ? styles.activeLink : styles.link
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
