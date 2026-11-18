import styles from "./form/form-layout.module.css";

type Props = {
  status: string;
  publish: (formData: FormData) => void | Promise<void>;
  unpublish: (formData: FormData) => void | Promise<void>;
  archive: (formData: FormData) => void | Promise<void>;
};

export function CmsStatusActions({
  status,
  publish,
  unpublish,
  archive,
}: Props) {
  return (
    <div className={styles.actions}>
      {status !== "PUBLISHED" ? (
        <form action={publish}>
          <button type="submit" className={`${styles.action} ${styles.actionPublish}`}>
            Publish
          </button>
        </form>
      ) : (
        <form action={unpublish}>
          <button type="submit" className={`${styles.action} ${styles.actionNeutral}`}>
            Unpublish
          </button>
        </form>
      )}
      {status !== "ARCHIVED" ? (
        <form action={archive}>
          <button type="submit" className={`${styles.action} ${styles.actionDanger}`}>
            Archive
          </button>
        </form>
      ) : null}
    </div>
  );
}
