import { EmptyState } from "@/components/content-states";
import type { MemberOrganisationListItem } from "@/lib/member-organisations-data";
import { MemberOrgCard } from "./member-org-card";
import styles from "./member-org-list.module.css";

type Props = {
  organisations: MemberOrganisationListItem[];
};

export function MemberOrgList({ organisations }: Props) {
  if (organisations.length === 0) {
    return (
      <EmptyState
        title="No member organisations published yet"
        message="Network members will appear here when they are published."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {organisations.map((organisation) => (
        <MemberOrgCard key={organisation.id} organisation={organisation} />
      ))}
    </ul>
  );
}
