import Link from "next/link";
import type { HomeIdentity } from "@/lib/home-data";
import styles from "./home-identity.module.css";

type Props = {
  identity: HomeIdentity;
};

export function HomeIdentitySection({ identity }: Props) {
  return (
    <section className={styles.section} aria-labelledby="identity-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Who we are</p>
          <h2 id="identity-heading" className={styles.title}>
            Purpose that guides the network
          </h2>
        </div>
        <div className={styles.grid}>
          <article className={styles.panel}>
            <h3 className={styles.label}>Our mission</h3>
            <p className={styles.copy}>{identity.mission}</p>
          </article>
          <article className={styles.panel}>
            <h3 className={styles.label}>Our vision</h3>
            <p className={styles.copy}>{identity.vision}</p>
          </article>
        </div>
        <p className={styles.more}>
          <Link href="/about">Learn more about NAC</Link>
        </p>
      </div>
    </section>
  );
}
