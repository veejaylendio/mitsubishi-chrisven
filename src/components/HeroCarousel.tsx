"use client";

import { useEffect, useState } from "react";
import LazyImage from "./LazyImage";

export type HeroSlide = {
  id: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];
  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section className="relative h-[calc(100vh-5rem)] min-h-[520px] w-full overflow-hidden bg-brand-black">
      {slide.image_url && (
        <LazyImage
          key={slide.id}
          src={slide.image_url}
          alt={slide.title ?? ""}
          wrapperClassName="absolute inset-0 h-full w-full"
          lcp
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-20 text-brand-white sm:px-16 sm:pb-24">
        {slide.title && (
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-6xl">
            {slide.title}
          </h1>
        )}
        {slide.body && (
          <p className="mt-4 max-w-xl text-base text-white/90 sm:text-lg">{slide.body}</p>
        )}
        <a
          href="#inventory"
          className="mt-8 w-fit border border-white px-6 py-3 text-sm font-semibold tracking-wide transition hover:bg-white hover:text-brand-black"
        >
          VIEW AVAILABLE VEHICLES
        </a>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/70 transition hover:text-white sm:left-8"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white/70 transition hover:text-white sm:right-8"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === index ? "w-8 bg-brand-red" : "w-4 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
