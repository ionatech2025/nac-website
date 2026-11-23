import { EmptyState } from "@/components/content-states";
import type { ProgrammeListItem } from "@/lib/programmes-data";
import { ProgrammeCard } from "./programme-card";
import styles from "./programme-list.module.css";

type Props = {
  programmes: ProgrammeListItem[];
};

export function ProgrammeList({ programmes }: Props) {
  if (programmes.length === 0) {
    return (
      <EmptyState
        title="No programmes published yet"
        message="Programme areas will appear here when they are published."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {programmes.map((programme) => (
        <ProgrammeCard key={programme.id} programme={programme} />
      ))}
    </ul>
  );
}
