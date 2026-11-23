import { EmptyState } from "@/components/content-states";
import type { OpportunityItem } from "@/lib/opportunities-data";
import { OpportunityCard } from "./opportunity-card";
import styles from "./opportunity-list.module.css";

type Props = {
  opportunities: OpportunityItem[];
};

export function OpportunityList({ opportunities }: Props) {
  if (opportunities.length === 0) {
    return (
      <EmptyState
        title="No opportunities match"
        message="Try clearing filters or check back soon for new openings."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </ul>
  );
}
