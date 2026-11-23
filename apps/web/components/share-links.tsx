import { ExternalLink } from "@/components/external-link";
import { buildShareTargets } from "@/lib/share-links";
import styles from "./share-links.module.css";

type Props = {
  path: string;
  title: string;
};

export function ShareLinks({ path, title }: Props) {
  const targets = buildShareTargets(path, title);

  return (
    <nav className={styles.nav} aria-label="Share this page">
      <p className={styles.label}>Share</p>
      <ul className={styles.list}>
        {targets.map((target) => (
          <li key={target.id}>
            <ExternalLink href={target.href} className={styles.link}>
              {target.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
