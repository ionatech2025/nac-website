import type { Metadata } from "next";
import { StaffList } from "@/components/staff/staff-list";
import { publicPageMetadata } from "@/lib/page-metadata";
import { listStaffMembers } from "@/lib/staff-data";
import styles from "./staff.module.css";

export const metadata: Metadata = publicPageMetadata({
  title: "Our Staff",
  description:
    "Meet the people who coordinate NAC’s programmes, partnerships, and youth spaces.",
  path: "/staff",
});

export default async function StaffPage() {
  const members = await listStaffMembers();

  return (
    <section className={styles.page} aria-labelledby="staff-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="staff-heading" className={styles.title}>
        Our Staff
      </h1>
      <p className={styles.lead}>
        The people coordinating NAC’s programmes, partnerships, and youth
        spaces across Uganda.
      </p>
      <StaffList members={members} />
    </section>
  );
}
