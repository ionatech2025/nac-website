import Link from "next/link";
import {
  formatOpportunityDate,
  labelStatus,
  type OpportunityItem,
} from "@/lib/opportunities-data";
import styles from "./opportunity-card.module.css";

type Props = {
  opportunity: OpportunityItem;
};

export function OpportunityCard({ opportunity }: Props) {
  const open = opportunity.derivedStatus === "OPEN";
  const opens = formatOpportunityDate(opportunity.openingDate);
  const closes = formatOpportunityDate(opportunity.closingDate);

  return (
    <li className={styles.item}>
      <div className={styles.top}>
        <span
          className={open ? styles.badgeOpen : styles.badgeClosed}
          aria-label={`Status: ${labelStatus(opportunity.derivedStatus)}`}
        >
          {labelStatus(opportunity.derivedStatus)}
        </span>
        {opportunity.type ? (
          <span className={styles.type}>{opportunity.type.name}</span>
        ) : null}
      </div>
      <h2 className={styles.title}>
        <Link href={`/opportunities/${opportunity.slug}`}>{opportunity.title}</Link>
      </h2>
      <p className={styles.description}>{opportunity.description}</p>
      <dl className={styles.dates}>
        {opens ? (
          <div>
            <dt>Opens</dt>
            <dd>{opens}</dd>
          </div>
        ) : null}
        {closes ? (
          <div>
            <dt>Closes</dt>
            <dd>{closes}</dd>
          </div>
        ) : null}
      </dl>
      {opportunity.attachments.length > 0 ? (
        <p className={styles.attachments}>
          {opportunity.attachments.length} PDF
          {opportunity.attachments.length === 1 ? "" : "s"} attached
        </p>
      ) : null}
      <Link className={styles.more} href={`/opportunities/${opportunity.slug}`}>
        View opportunity
      </Link>
    </li>
  );
}
