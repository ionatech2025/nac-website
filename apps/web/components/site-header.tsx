import Image from "next/image";
import Link from "next/link";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="NAC home">
          <Image
            src="/brand/nac-logo.png"
            alt=""
            width={112}
            height={112}
            className={styles.logo}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.org}>Network for Active Citizens</span>
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
