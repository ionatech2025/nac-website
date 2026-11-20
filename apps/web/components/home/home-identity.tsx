import type { HomeIdentity } from "@/lib/home-data";
import styles from "./home-identity.module.css";

type Props = {
  identity: HomeIdentity;
};

export function HomeIdentitySection({ identity }: Props) {
  return (
    <section className={styles.section} aria-labelledby="identity-heading">
      <div className={styles.inner}>
        <p className={styles.tagline}>{identity.tagline}</p>
        <h1 id="identity-heading" className={styles.name}>
          {identity.orgName}
        </h1>
        <div className={styles.grid}>
          <div>
            <h2 className={styles.label}>Our mission</h2>
            <p className={styles.copy}>{identity.mission}</p>
          </div>
          <div>
            <h2 className={styles.label}>Our vision</h2>
            <p className={styles.copy}>{identity.vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
