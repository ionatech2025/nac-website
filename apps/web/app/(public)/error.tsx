"use client";

import Link from "next/link";
import styles from "@/components/page-placeholder.module.css";
import stateStyles from "@/components/content-states.module.css";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PublicError({ reset }: Props) {
  return (
    <section className={styles.section} aria-labelledby="error-title">
      <p className={styles.kicker}>Unexpected error</p>
      <h1 id="error-title" className={styles.title}>
        Something went wrong
      </h1>
      <p className={styles.lead}>
        Please try again. If the problem continues, return home or contact NAC.
      </p>
      <div className={stateStyles.actions}>
        <button type="button" className={stateStyles.primary} onClick={reset}>
          Try again
        </button>
        <Link className={stateStyles.secondary} href="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
