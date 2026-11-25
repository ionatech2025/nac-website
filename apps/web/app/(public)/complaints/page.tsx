import type { Metadata } from "next";
import Link from "next/link";
import { ComplaintForm } from "@/components/complaints/complaint-form";
import { ComplaintIntro } from "@/components/complaints/complaint-intro";
import { complaintTodayYmd } from "@/lib/complaint-today";
import styles from "./complaints.module.css";

export const metadata: Metadata = {
  title: "Complaints",
  description:
    "Submit an anonymous complaint to Network for Active Citizens. No name or contact details are requested.",
  robots: { index: false, follow: false },
};

export default function ComplaintsPage() {
  const todayYmd = complaintTodayYmd();

  return (
    <section className={styles.page} aria-labelledby="complaints-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="complaints-heading" className={styles.title}>
        Anonymous complaints
      </h1>
      <p className={styles.lead}>
        Use this page to raise a concern without sharing your identity. Read the
        process notes before you submit. For a named reply, use the{" "}
        <Link href="/contact">inquiry form</Link>.
      </p>
      <div className={styles.layout}>
        <ComplaintIntro />
        <div className={styles.formColumn}>
          <ComplaintForm todayYmd={todayYmd} />
          <p className={styles.inquiryNote}>
            Prefer a reply by email?{" "}
            <Link href="/contact">Send an inquiry instead</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
