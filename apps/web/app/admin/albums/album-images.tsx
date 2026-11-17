import { mediaVariantUrl } from "@repo/database";
import { MAX_UPLOAD_BYTES } from "../../../lib/media-limits";
import { FileDrop } from "../_components/form/file-drop";
import styles from "./album-images.module.css";
import {
  addAlbumImages,
  moveAlbumImage,
  removeAlbumImage,
  updateAlbumImage,
} from "./image-actions";

type ImageRow = {
  id: string;
  caption: string | null;
  altText: string | null;
  sortOrder: number;
  media: { id: string; url: string; thumbUrl: string | null };
};

export function AlbumImagesPanel({
  albumId,
  images,
}: {
  albumId: string;
  images: ImageRow[];
}) {
  const maxMb = MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <div className={styles.panel}>
      <form
        action={addAlbumImages.bind(null, albumId)}
        className={styles.upload}
      >
        <FileDrop
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          hint={`JPEG, PNG or WebP · up to ${maxMb} MB each`}
        />
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          Upload photos
        </button>
      </form>

      {images.length === 0 ? (
        <p className={styles.empty}>No photos yet. Upload some above.</p>
      ) : (
        <ul className={styles.grid}>
          {images.map((img, index) => (
            <li key={img.id} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaVariantUrl(img.media, "thumb")} alt={img.altText ?? ""} className={styles.thumb} />
              <form
                action={updateAlbumImage.bind(null, img.id, albumId)}
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
                  placeholder="Alt text"
                  defaultValue={img.altText ?? ""}
                />
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  aria-label="Sort order"
                  defaultValue={img.sortOrder}
                />
                <div className={styles.cardActions}>
                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Save
                  </button>
                  {index > 0 ? (
                    <button
                      type="submit"
                      className={styles.btn}
                      title="Move up"
                      aria-label="Move up"
                      formAction={moveAlbumImage.bind(null, img.id, albumId, "up")}
                    >
                      ↑
                    </button>
                  ) : null}
                  {index < images.length - 1 ? (
                    <button
                      type="submit"
                      className={styles.btn}
                      title="Move down"
                      aria-label="Move down"
                      formAction={moveAlbumImage.bind(null, img.id, albumId, "down")}
                    >
                      ↓
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    formAction={removeAlbumImage.bind(null, img.id, albumId)}
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
