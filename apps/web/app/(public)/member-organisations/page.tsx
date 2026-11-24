import type { Metadata } from "next";
import { MemberOrgList } from "@/components/member-organisations/member-org-list";
import { listMemberOrganisations } from "@/lib/member-organisations-data";
import styles from "./member-organisations.module.css";

export const metadata: Metadata = {
  title: "Member organisations",
  description:
    "Organisations in the Network for Active Citizens — youth-led groups working with NAC across Uganda.",
};

export default async function MemberOrganisationsPage() {
  const organisations = await listMemberOrganisations();

  return (
    <section className={styles.page} aria-labelledby="members-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="members-heading" className={styles.title}>
        Member organisations
      </h1>
      <p className={styles.lead}>
        NAC is a network of member organisations. Meet the groups that share
        spaces, programmes and advocacy with young people across Uganda.
      </p>
      <MemberOrgList organisations={organisations} />
    </section>
  );
}
