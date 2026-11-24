"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SlideshowSlide } from "@/lib/home-data";
import styles from "./hero-slideshow.module.css";

type Props = {
  slides: SlideshowSlide[];
};

export function HeroSlideshow({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  if (slides.length === 0) {
    return (
      <section className={styles.fallback} aria-label="Homepage hero">
        <div className={styles.fallbackInner}>
          <p className={styles.fallbackKicker}>Network for Active Citizens</p>
          <h1 className={styles.fallbackTitle}>
            Building youth resilience across Uganda
          </h1>
        </div>
      </section>
    );
  }

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  const media = (
    <Image
      src={slide.imageUrl}
      alt={slide.altText}
      fill
      priority={index === 0}
      sizes="100vw"
      className={styles.image}
    />
  );

  return (
    <section className={styles.hero} aria-roledescription="carousel" aria-label="Homepage slideshow">
      <div className={styles.frame} aria-live="polite">
        {slide.destinationUrl ? (
          <Link href={slide.destinationUrl} className={styles.mediaLink}>
            {media}
          </Link>
        ) : (
          media
        )}
        <div className={styles.wash} aria-hidden="true" />
        {slide.caption ? (
          <p className={styles.caption}>{slide.caption}</p>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
          >
            {paused ? "Play slideshow" : "Pause slideshow"}
          </button>
          <div className={styles.dots} role="tablist" aria-label="Slides">
            {slides.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                className={
                  slideIndex === index ? styles.dotActive : styles.dot
                }
                onClick={() => setIndex(slideIndex)}
              >
                <span className={styles.srOnly}>Slide {slideIndex + 1}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
