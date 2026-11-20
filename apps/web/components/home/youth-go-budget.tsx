import { ExternalLink } from "@/components/external-link";
import styles from "./youth-go-budget.module.css";

type Props = {
  href: string;
};

export function YouthGoBudgetPromo({ href }: Props) {
  return (
    <section className={styles.section} aria-labelledby="ygb-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Partner tool</p>
        <h2 id="ygb-heading" className={styles.title}>
          The Youth Go Budget app
        </h2>
        <p className={styles.copy}>
          Mobilize young people to take part in budgeting processes and push for
          pro-youth, gender-sensitive local decisions.
        </p>
        <ExternalLink href={href} className={styles.cta}>
          Open Youth Go Budget
        </ExternalLink>
      </div>
    </section>
  );
}
