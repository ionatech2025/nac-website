import { mediaVariantUrl } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import styles from "../albums/album-images.module.css";
import { FileDrop } from "../_components/form/file-drop";
import {
  addAboutPhotos,
  moveAboutPhoto,
  removeAboutPhoto,
  updateAboutPhoto,
} from "./image-actions";
import { MAX_ABOUT_PHOTOS } from "./limits";

export type AboutPhoto = {
  id: string;
  caption: string | null;
  media: { id: string; url: string; thumbUrl: string | null; altText: string | null };
};

export function AboutPhotosPanel({ images }: { images: AboutPhoto[] }) {
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);
  const remaining = MAX_ABOUT_PHOTOS - images.length;

  return (
    <div className={styles.panel}>
      {remaining > 0 ? (
        <form action={addAboutPhotos} className={styles.upload}>
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
          About Us has the maximum of {MAX_ABOUT_PHOTOS} photos. Remove one to add another.
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
              <form action={updateAboutPhoto.bind(null, img.id)} className={styles.cardForm}>
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
                      formAction={moveAboutPhoto.bind(null, img.id, "up")}
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
                      formAction={moveAboutPhoto.bind(null, img.id, "down")}
                    >
                      ↓
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    formAction={removeAboutPhoto.bind(null, img.id)}
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
