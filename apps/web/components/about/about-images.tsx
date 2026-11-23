import Image from "next/image";
import { aboutImageSrc, type AboutImage } from "@/lib/about-data";
import styles from "./about-images.module.css";

type Props = {
  images: AboutImage[];
};

export function AboutImages({ images }: Props) {
  if (images.length === 0) return null;

  return (
    <ul className={styles.list}>
      {images.map((image) => {
        const src = aboutImageSrc(image.media);
        const alt = image.media.altText?.trim() || image.caption?.trim() || "";
        return (
          <li key={image.id} className={styles.item}>
            <div className={styles.frame}>
              <Image
                src={src}
                alt={alt}
                width={image.media.width ?? 960}
                height={image.media.height ?? 640}
                className={styles.image}
                sizes="(max-width: 800px) 100vw, 480px"
                unoptimized
              />
            </div>
            {image.caption ? (
              <p className={styles.caption}>{image.caption}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
