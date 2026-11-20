import Image from "next/image";
import { EmptyState } from "@/components/content-states";
import { ExternalLink } from "@/components/external-link";
import type { PartnerItem } from "@/lib/home-data";
import { SectionShell } from "./section-shell";
import styles from "./partners-strip.module.css";

type Props = {
  partners: PartnerItem[];
};

export function PartnersStrip({ partners }: Props) {
  return (
    <SectionShell
      id="partners"
      eyebrow="Network"
      title="Partners"
      lead="Organisations NAC works with across Uganda."
    >
      {partners.length === 0 ? (
        <EmptyState title="No partners published yet" />
      ) : (
        <ul className={styles.list}>
          {partners.map((partner) => {
            const content = partner.logoUrl ? (
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                width={160}
                height={64}
                className={styles.logo}
              />
            ) : (
              <span className={styles.name}>{partner.name}</span>
            );

            return (
              <li key={partner.id} className={styles.item}>
                {partner.websiteUrl ? (
                  <ExternalLink href={partner.websiteUrl} className={styles.link}>
                    {content}
                  </ExternalLink>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </SectionShell>
  );
}
