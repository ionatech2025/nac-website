import {
  archiveOpportunity,
  closeOpportunityEarly,
  publishOpportunity,
  reopenOpportunity,
  unpublishOpportunity,
} from "./actions";
import layoutStyles from "../_components/form/form-layout.module.css";

const publishClass = `${layoutStyles.action} ${layoutStyles.actionPublish}`;
const neutralClass = `${layoutStyles.action} ${layoutStyles.actionNeutral}`;
const dangerClass = `${layoutStyles.action} ${layoutStyles.actionDanger}`;

export function OpportunityActionsBar({
  id,
  status,
  manualStatus,
}: {
  id: string;
  status: string;
  manualStatus: string;
}) {
  return (
    <div className={layoutStyles.actions}>
      {status !== "PUBLISHED" ? (
        <form action={publishOpportunity.bind(null, id)}>
          <button type="submit" className={publishClass}>
            Publish
          </button>
        </form>
      ) : (
        <form action={unpublishOpportunity.bind(null, id)}>
          <button type="submit" className={neutralClass}>
            Unpublish
          </button>
        </form>
      )}
      {manualStatus !== "CLOSED" ? (
        <form action={closeOpportunityEarly.bind(null, id)}>
          <button type="submit" className={neutralClass}>
            Close early
          </button>
        </form>
      ) : (
        <form action={reopenOpportunity.bind(null, id)}>
          <button type="submit" className={neutralClass}>
            Reopen (use dates)
          </button>
        </form>
      )}
      {status !== "ARCHIVED" ? (
        <form action={archiveOpportunity.bind(null, id)}>
          <button type="submit" className={dangerClass}>
            Archive
          </button>
        </form>
      ) : null}
    </div>
  );
}
