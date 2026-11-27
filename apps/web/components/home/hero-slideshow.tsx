"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeIdentity, SlideshowSlide } from "@/lib/home-data";
import styles from "./hero-slideshow.module.css";

type Props = {
  slides: SlideshowSlide[];
  identity: HomeIdentity;
};

export function HeroSlideshow({ slides, identity }: Props) {
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
    }, 6500);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const slide = slides[index] ?? slides[0];

  return (
    <section
      className={styles.hero}
      aria-roledescription={slides.length > 1 ? "carousel" : undefined}
      aria-label="Homepage hero"
    >
      <div className={styles.frame} aria-live="polite">
        {slide ? (
          <Image
            src={slide.imageUrl}
            alt={slide.altText}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.plain} aria-hidden="true" />
        )}
        <div className={styles.wash} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <p className={styles.kicker}>{identity.tagline}</p>
        <h1 className={styles.brand}>{identity.orgName}</h1>
        <p className={styles.support}>{identity.mission}</p>
        <div className={styles.ctas}>
          <Link href="/programs" className={styles.primary}>
            Explore programmes
          </Link>
          <Link href="/youth-spaces" className={styles.secondary}>
            Youth spaces
          </Link>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
          >
            {paused ? "Play" : "Pause"}
          </button>
          <div className={styles.dots} role="tablist" aria-label="Slides">
            {slides.map((item, slideIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                className={slideIndex === index ? styles.dotActive : styles.dot}
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
