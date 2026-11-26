import Link from "next/link";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="NAC home">
          {/* eslint-disable-next-line @next/next/no-img-element -- same static brand asset as admin/login */}
          <img
            src="/brand/nac-logo.png"
            alt=""
            className={styles.logo}
            width={112}
            height={112}
          />
          <span className={styles.brandText}>
            <span className={styles.orgShort}>NAC</span>
            <span className={styles.orgFull}>Network for Active Citizens</span>
            <span className={styles.tagline}>
              Locally Engaged, Globally Connected
            </span>
          </span>
        </Link>

        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}
