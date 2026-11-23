import Link from "next/link";
import {
  applyMailto,
  formatOpportunityDate,
  labelStatus,
  type OpportunityItem,
} from "@/lib/opportunities-data";
import { RichText } from "@/lib/rich-text-view";
import styles from "./opportunity-detail.module.css";

type Props = {
  opportunity: OpportunityItem;
};

export function OpportunityDetailView({ opportunity }: Props) {
  const open = opportunity.derivedStatus === "OPEN";
  const opens = formatOpportunityDate(opportunity.openingDate);
  const closes = formatOpportunityDate(opportunity.closingDate);

  return (
    <article className={styles.page}>
      <p className={styles.eyebrow}>
        <Link href="/opportunities">Opportunities</Link>
      </p>
      <div className={styles.top}>
        <span className={open ? styles.badgeOpen : styles.badgeClosed}>
          {labelStatus(opportunity.derivedStatus)}
        </span>
        {opportunity.type ? (
          <span className={styles.type}>{opportunity.type.name}</span>
        ) : null}
      </div>
      <h1 className={styles.title}>{opportunity.title}</h1>

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

      <RichText text={opportunity.description} className={styles.body} />

      {opportunity.attachments.length > 0 ? (
        <section className={styles.block} aria-labelledby="docs-heading">
          <h2 id="docs-heading" className={styles.heading}>
            Documents
          </h2>
          <ul className={styles.docs}>
            {opportunity.attachments.map((file) => (
              <li key={file.id}>
                <a href={file.href} target="_blank" rel="noopener noreferrer">
                  {file.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.block} aria-labelledby="apply-heading">
        <h2 id="apply-heading" className={styles.heading}>
          How to apply
        </h2>
        {opportunity.applicationInstructions ? (
          <RichText
            text={opportunity.applicationInstructions}
            className={styles.instructions}
          />
        ) : null}
        <p className={styles.contact}>
          <span className={styles.contactLabel}>Email</span>
          {open ? (
            <a href={applyMailto(opportunity.contactEmail, opportunity.title)}>
              {opportunity.contactEmail}
            </a>
          ) : (
            <span>{opportunity.contactEmail}</span>
          )}
        </p>
        {opportunity.contactPhone ? (
          <p className={styles.contact}>
            <span className={styles.contactLabel}>Phone</span>
            <a href={`tel:${opportunity.contactPhone.replace(/\s+/g, "")}`}>
              {opportunity.contactPhone}
            </a>
          </p>
        ) : null}
        {open ? (
          <a
            className={styles.apply}
            href={applyMailto(opportunity.contactEmail, opportunity.title)}
          >
            Apply by email
          </a>
        ) : (
          <p className={styles.closedNote}>
            This opportunity is closed and is not accepting applications.
          </p>
        )}
      </section>
    </article>
  );
}
