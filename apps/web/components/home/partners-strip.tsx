import Image from "next/image";
import { ExternalLink } from "@/components/external-link";
import type { PartnerItem } from "@/lib/home-data";
import { SectionShell } from "./section-shell";
import styles from "./partners-strip.module.css";

type Props = {
  partners: PartnerItem[];
};

export function PartnersStrip({ partners }: Props) {
  if (partners.length === 0) return null;

  return (
    <SectionShell
      id="partners"
      eyebrow="Network"
      title="Partners we work with"
      lead="Organisations standing with NAC across Uganda."
    >
      <ul className={styles.list}>
        {partners.map((partner) => {
          const content = partner.logoUrl ? (
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              width={220}
              height={88}
              className={styles.logo}
              unoptimized
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
                <div className={styles.link}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
