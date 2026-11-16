import styles from "./admin.module.css";

export default function AdminHomePage() {
  return (
    <section className={styles.panel}>
      <h1>Dashboard</h1>
      <p>
        Auth gate is active (AD-B1-01). Visitor stats and content shortcuts land
        in later B2/B3 stories.
      </p>
    </section>
  );
}
