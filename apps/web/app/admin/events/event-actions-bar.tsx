import {
  archiveEvent,
  cancelEvent,
  publishEvent,
  unpublishEvent,
} from "./actions";
import layoutStyles from "../_components/form/form-layout.module.css";

export function EventActionsBar({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  return (
    <div className={layoutStyles.actions}>
      {status !== "PUBLISHED" && status !== "ARCHIVED" ? (
        <form action={publishEvent.bind(null, id)}>
          <button
            type="submit"
            className={`${layoutStyles.action} ${layoutStyles.actionPublish}`}
          >
            Publish
          </button>
        </form>
      ) : null}
      {status === "PUBLISHED" ? (
        <form action={unpublishEvent.bind(null, id)}>
          <button
            type="submit"
            className={`${layoutStyles.action} ${layoutStyles.actionNeutral}`}
          >
            Unpublish
          </button>
        </form>
      ) : null}
      {status !== "CANCELLED" && status !== "ARCHIVED" ? (
        <form action={cancelEvent.bind(null, id)}>
          <button
            type="submit"
            className={`${layoutStyles.action} ${layoutStyles.actionNeutral}`}
          >
            Cancel event
          </button>
        </form>
      ) : null}
      {status !== "ARCHIVED" ? (
        <form action={archiveEvent.bind(null, id)}>
          <button
            type="submit"
            className={`${layoutStyles.action} ${layoutStyles.actionDanger}`}
          >
            Archive
          </button>
        </form>
      ) : null}
    </div>
  );
}
