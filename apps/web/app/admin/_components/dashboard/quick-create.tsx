import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminIcon } from "../../../../lib/admin-icons";
import { ADMIN_QUICK_LINKS } from "../../../../lib/admin-quick-links";
import layout from "./dashboard.module.css";
import styles from "./quick-create.module.css";

export function QuickCreate() {
  return (
    <section className={layout.card} aria-labelledby="quick-create-title">
      <header className={layout.cardHeader}>
        <div>
          <h2 id="quick-create-title" className={layout.cardTitle}>
            Quick create
          </h2>
          <p className={layout.cardSub}>Start a new draft</p>
        </div>
      </header>
      <div className={layout.cardBody}>
        <ul className={styles.grid}>
          {ADMIN_QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.tile}>
                <span className={styles.icon}>
                  <AdminIcon name={link.icon} size={16} />
                </span>
                <span className={styles.label}>{link.label}</span>
                <Plus size={14} className={styles.plus} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
