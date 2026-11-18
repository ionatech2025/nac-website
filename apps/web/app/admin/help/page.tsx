import Link from "next/link";
import { Mail } from "lucide-react";
import { requireAdmin } from "../../../lib/require-admin";
import adminStyles from "../admin.module.css";
import { HELP_TOPICS, SUPPORT_CONTACTS } from "./help-content";
import styles from "./help.module.css";

export default async function AdminHelpPage() {
  await requireAdmin();

  return (
    <section className={adminStyles.panel}>
      <p className={adminStyles.eyebrow}>
        <Link href="/admin">← Dashboard</Link>
      </p>
      <h1>Help &amp; support</h1>
      <p className={styles.lead}>How to add and publish content, and who to contact when something breaks.</p>

      <div className={styles.layout}>
        <div className={styles.topics}>
          <nav className={styles.toc} aria-label="Help topics">
            {HELP_TOPICS.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                {t.title}
              </a>
            ))}
          </nav>

          {HELP_TOPICS.map((topic) => (
            <article key={topic.id} id={topic.id} className={styles.card}>
              <h2>{topic.title}</h2>
              <ul>
                {topic.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {topic.href ? (
                <Link href={topic.href} className={styles.goto}>
                  Open this section →
                </Link>
              ) : null}
            </article>
          ))}
        </div>

        <aside className={styles.support}>
          <h2>Technical support</h2>
          <p>
            Contact iONA if the site is down, something shows an error, uploads fail, or you are locked out.
          </p>
          <ul className={styles.contacts}>
            {SUPPORT_CONTACTS.map((c) => (
              <li key={c.email}>
                <span>{c.label}</span>
                <a href={`mailto:${c.email}`}>
                  <Mail size={14} aria-hidden /> {c.email}
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            iONA looks after the technical side only. Writing, editing and publishing content is done by
            NAC.
          </p>
          <p className={styles.note}>
            When reporting a problem, say which page you were on, what you clicked, and include a screenshot
            if you can.
          </p>
        </aside>
      </div>
    </section>
  );
}
