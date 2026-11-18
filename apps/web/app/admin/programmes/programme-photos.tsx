import { mediaVariantUrl } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import styles from "../albums/album-images.module.css";
import { FileDrop } from "../_components/form/file-drop";
import {
  addProgrammePhotos,
  moveProgrammePhoto,
  removeProgrammePhoto,
  updateProgrammePhoto,
} from "./image-actions";
import { MAX_PROGRAMME_PHOTOS } from "./limits";

export type ProgrammePhoto = {
  id: string;
  caption: string | null;
  media: { id: string; url: string; thumbUrl: string | null; altText: string | null };
};

export function ProgrammePhotosPanel({
  programmeId,
  images,
}: {
  programmeId: string;
  images: ProgrammePhoto[];
}) {
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);
  const remaining = MAX_PROGRAMME_PHOTOS - images.length;

  return (
    <div className={styles.panel}>
      {remaining > 0 ? (
        <form action={addProgrammePhotos.bind(null, programmeId)} className={styles.upload}>
          <FileDrop
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            hint={`JPEG, PNG or WebP · up to ${maxMb} MB each · ${remaining} more allowed`}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Upload photos
          </button>
        </form>
      ) : (
        <p className={styles.empty}>
          This programme has the maximum of {MAX_PROGRAMME_PHOTOS} photos. Remove one to add
          another.
        </p>
      )}

      {images.length === 0 ? (
        <p className={styles.empty}>No photos yet.</p>
      ) : (
        <ul className={styles.grid}>
          {images.map((img, index) => (
            <li key={img.id} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaVariantUrl(img.media, "thumb")}
                alt={img.media.altText ?? ""}
                className={styles.thumb}
              />
              <form
                action={updateProgrammePhoto.bind(null, img.id, programmeId)}
                className={styles.cardForm}
              >
                <input
                  name="caption"
                  aria-label="Caption"
                  placeholder="Caption"
                  defaultValue={img.caption ?? ""}
                />
                <input
                  name="altText"
                  aria-label="Alt text"
                  placeholder="Alt text (describe the photo)"
                  defaultValue={img.media.altText ?? ""}
                />
                <div className={styles.cardActions}>
                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Save
                  </button>
                  {index > 0 ? (
                    <button
                      type="submit"
                      className={styles.btn}
                      aria-label="Move up"
                      title="Move up"
                      formAction={moveProgrammePhoto.bind(null, img.id, programmeId, "up")}
                    >
                      ↑
                    </button>
                  ) : null}
                  {index < images.length - 1 ? (
                    <button
                      type="submit"
                      className={styles.btn}
                      aria-label="Move down"
                      title="Move down"
                      formAction={moveProgrammePhoto.bind(null, img.id, programmeId, "down")}
                    >
                      ↓
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    formAction={removeProgrammePhoto.bind(null, img.id, programmeId)}
                  >
                    Remove
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
