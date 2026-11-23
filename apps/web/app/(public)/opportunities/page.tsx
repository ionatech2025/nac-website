import type { Metadata } from "next";
import { OpportunityFilters } from "@/components/opportunities/opportunity-filters";
import { OpportunityList } from "@/components/opportunities/opportunity-list";
import {
  listOpportunities,
  listOpportunityTypes,
  type OpportunityFilters as FilterValues,
} from "@/lib/opportunities-data";
import styles from "./opportunities.module.css";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Open calls, jobs, fellowships and membership opportunities from Network for Active Citizens.",
};

type Props = {
  searchParams: Promise<{
    status?: string;
    type?: string;
    sort?: string;
    closingFrom?: string;
    closingTo?: string;
  }>;
};

function parseFilters(
  params: Awaited<Props["searchParams"]>,
): FilterValues & {
  status: string;
  type: string;
  sort: string;
  closingFrom: string;
  closingTo: string;
} {
  const statusRaw = (params.status ?? "all").toLowerCase();
  const status =
    statusRaw === "open" || statusRaw === "closed" || statusRaw === "all"
      ? statusRaw
      : "all";
  const sortRaw = (params.sort ?? "closing-asc").toLowerCase();
  const sort =
    sortRaw === "closing-desc" ? "closing-desc" : "closing-asc";

  return {
    status,
    type: params.type?.trim() ?? "",
    sort,
    closingFrom: params.closingFrom?.trim() ?? "",
    closingTo: params.closingTo?.trim() ?? "",
  };
}

export default async function OpportunitiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const [types, opportunities] = await Promise.all([
    listOpportunityTypes(),
    listOpportunities(filters),
  ]);

  return (
    <section className={styles.page} aria-labelledby="opportunities-heading">
      <p className={styles.eyebrow}>Network for Active Citizens</p>
      <h1 id="opportunities-heading" className={styles.title}>
        Opportunities
      </h1>
      <p className={styles.lead}>
        Calls, jobs, fellowships and membership openings. Apply by email outside
        the site — there is no in-site application form.
      </p>
      <OpportunityFilters types={types} values={filters} />
      <OpportunityList opportunities={opportunities} />
    </section>
  );
}
