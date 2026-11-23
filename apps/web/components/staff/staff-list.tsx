import { EmptyState } from "@/components/content-states";
import type { StaffMember } from "@/lib/staff-data";
import { StaffMemberCard } from "./staff-member";
import styles from "./staff-list.module.css";

type Props = {
  members: StaffMember[];
};

export function StaffList({ members }: Props) {
  if (members.length === 0) {
    return (
      <EmptyState
        title="No staff published yet"
        message="The directory will appear here when team members are published."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {members.map((member) => (
        <StaffMemberCard key={member.id} member={member} />
      ))}
    </ul>
  );
}
