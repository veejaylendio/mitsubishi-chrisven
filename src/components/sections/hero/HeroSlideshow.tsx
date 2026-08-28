"use client";

import { useEffect, useState } from "react";
import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

/** Auto-rotating hero with a thumbnail strip for direct navigation (vs. dots). */
export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index];

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
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        style={{ opacity: slide.overlay_opacity }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-28 text-brand-white sm:px-16 sm:pb-32">
        {slide.title && (
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-6xl">
            {slide.title}
          </h1>
        )}
        {slide.subtitle && (
          <p className="mt-3 max-w-xl text-lg font-medium text-white/95">{slide.subtitle}</p>
        )}
        {slide.body && <p className="mt-4 max-w-xl text-base text-white/90">{slide.body}</p>}
        {slide.buttons.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {slide.buttons.map((button, i) => (
              <CtaButtonLink key={`${button.label}-${i}`} button={button} />
            ))}
          </div>
        ) : (
          <a
            href="#inventory"
            className="mt-8 w-fit border border-white px-6 py-3 text-sm font-semibold tracking-wide transition hover:bg-white hover:text-brand-black"
          >
            VIEW AVAILABLE VEHICLES
          </a>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 px-4">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-14 w-20 shrink-0 overflow-hidden rounded border-2 transition ${
                i === index ? "border-brand-red" : "border-white/40 opacity-70 hover:opacity-100"
              }`}
            >
              {s.image_url && (
                <LazyImage src={s.image_url} alt="" wrapperClassName="h-full w-full" eager />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
