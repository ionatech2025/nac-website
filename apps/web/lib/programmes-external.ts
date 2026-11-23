import type { ProgrammeExternalKey } from "./programmes-data";
import type { ExternalServices } from "./site-settings";

const EXTERNAL_LABELS: Record<ProgrammeExternalKey, string> = {
  youthGoBudget: "Youth Go Budget",
  slogbaa: "SLOGBAA",
};

/** Resolve programme partner links from editable site settings (E14-01). */
export function resolveProgrammeExternalLinks(
  keys: ProgrammeExternalKey[],
  services: ExternalServices,
): { label: string; href: string }[] {
  return keys.flatMap((key) => {
    const href = services[key].trim();
    return href ? [{ label: EXTERNAL_LABELS[key], href }] : [];
  });
}
