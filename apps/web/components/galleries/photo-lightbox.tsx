"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import type { GalleryImage } from "@/lib/galleries-data";
import styles from "./photo-lightbox.module.css";

type Props = {
  images: GalleryImage[];
  albumTitle: string;
};

export function PhotoLightbox({ images, albumTitle }: Props) {
  const titleId = useId();
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = index === null ? null : images[index] ?? null;

  const close = useCallback(() => setIndex(null), []);
  const show = useCallback((next: number) => {
    if (images.length === 0) return;
    setIndex((next + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") show((index ?? 0) + 1);
      if (event.key === "ArrowLeft") show((index ?? 0) - 1);
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, index, close, show]);

  return (
    <>
      <ul className={styles.grid}>
        {images.map((image, i) => (
          <li key={image.id}>
            <button
              type="button"
              className={styles.thumb}
              onClick={() => setIndex(i)}
              aria-label={`Open ${image.altText}`}
            >
              <Image
                src={image.url}
                alt={image.altText}
                width={640}
                height={480}
                className={styles.thumbImage}
                sizes="(max-width: 800px) 50vw, 280px"
              />
              {image.caption ? (
                <span className={styles.caption}>{image.caption}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {open && current ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.toolbar}>
              <p id={titleId} className={styles.title}>
                {albumTitle} · {(index ?? 0) + 1} of {images.length}
              </p>
              <button type="button" className={styles.close} onClick={close}>
                Close
              </button>
            </div>
            <div className={styles.stage}>
              <Image
                src={current.url}
                alt={current.altText}
                width={1200}
                height={800}
                className={styles.full}
                sizes="100vw"
                priority
              />
            </div>
            {current.caption ? (
              <p className={styles.dialogCaption}>{current.caption}</p>
            ) : null}
            {images.length > 1 ? (
              <div className={styles.nav}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => show((index ?? 0) - 1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => show((index ?? 0) + 1)}
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
