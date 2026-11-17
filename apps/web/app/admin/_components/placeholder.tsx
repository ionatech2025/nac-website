import Link from "next/link";
import styles from "../admin.module.css";

export function AdminPlaceholder({
  title,
  epic,
}: {
  title: string;
  epic: string;
}) {
  return (
    <section className={styles.panel}>
      <p className={styles.eyebrow}>
        <Link href="/admin">← Dashboard</Link>
      </p>
      <h1>{title}</h1>
      <p>
        Screen shell for navigation. Full create/edit UI lands in{" "}
        <strong>{epic}</strong>.
      </p>
    </section>
  );
}
