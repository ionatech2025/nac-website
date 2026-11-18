import { AsideCard } from "./form/form-page";
import styles from "./form/form-layout.module.css";

export function PreviewPanel({
  title,
  lines,
}: {
  title: string;
  lines: { label: string; value: string }[];
}) {
  return (
    <AsideCard title="Summary">
      <p className={styles.note}>
        <strong style={{ color: "#0f172a" }}>{title}</strong>
      </p>
      <dl className={styles.meta}>
        {lines.map((line) => (
          <div key={line.label}>
            <dt>{line.label}</dt>
            <dd title={line.value}>{line.value || "—"}</dd>
          </div>
        ))}
      </dl>
    </AsideCard>
  );
}
