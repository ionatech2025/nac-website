"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { ADMIN_NAV_LINKS } from "../../../lib/admin-nav";
import styles from "../admin-topbar.module.css";

function sectionFor(pathname: string) {
  const matches = ADMIN_NAV_LINKS.filter(
    (link) =>
      link.href !== "/admin" &&
      (pathname === link.href || pathname.startsWith(`${link.href}/`)),
  );
  return matches.sort((a, b) => b.href.length - a.href.length)[0];
}

function leafLabel(pathname: string, sectionHref: string): string | null {
  const rest = pathname.slice(sectionHref.length).replace(/^\//, "");
  if (!rest) return null;
  return rest === "new" ? "New" : "Edit";
}

export function AdminTopbar() {
  const pathname = usePathname();
  const section = sectionFor(pathname);
  const leaf = section ? leafLabel(pathname, section.href) : null;

  return (
    <header className={styles.topbar}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <span className={styles.org}>Network for Active Citizens</span>
        <ChevronRight size={14} className={styles.sep} aria-hidden />
        {section ? (
          <>
            <Link
              href={section.href}
              className={leaf ? styles.crumbLink : styles.crumbCurrent}
            >
              {section.label}
            </Link>
            {leaf ? (
              <>
                <ChevronRight size={14} className={styles.sep} aria-hidden />
                <span className={styles.crumbCurrent}>{leaf}</span>
              </>
            ) : null}
          </>
        ) : (
          <span className={styles.crumbCurrent}>Dashboard</span>
        )}
      </nav>
      <Link href="/" target="_blank" className={styles.viewSite}>
        View site
        <ExternalLink size={14} aria-hidden />
      </Link>
    </header>
  );
}
