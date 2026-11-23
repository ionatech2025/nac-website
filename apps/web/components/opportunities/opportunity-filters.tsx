import type { OpportunityType } from "@/lib/opportunities-data";
import styles from "./opportunity-filters.module.css";

type Props = {
  types: OpportunityType[];
  values: {
    status: string;
    type: string;
    sort: string;
    closingFrom: string;
    closingTo: string;
  };
};

export function OpportunityFilters({ types, values }: Props) {
  return (
    <form className={styles.form} method="get" aria-label="Filter opportunities">
      <div className={styles.field}>
        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={values.status}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="type">Type</label>
        <select id="type" name="type" defaultValue={values.type}>
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type.id} value={type.slug}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="sort">Closing date</label>
        <select id="sort" name="sort" defaultValue={values.sort}>
          <option value="closing-asc">Soonest first</option>
          <option value="closing-desc">Latest first</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="closingFrom">Closing from</label>
        <input
          id="closingFrom"
          name="closingFrom"
          type="date"
          defaultValue={values.closingFrom}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="closingTo">Closing to</label>
        <input
          id="closingTo"
          name="closingTo"
          type="date"
          defaultValue={values.closingTo}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Apply filters
        </button>
        <a className={styles.reset} href="/opportunities">
          Reset
        </a>
      </div>
    </form>
  );
}
