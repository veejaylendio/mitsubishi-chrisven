"use client";

import { useEffect, useState } from "react";

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

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-brand-black">
      {slide.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.image_url}
          alt={slide.title ?? ""}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-brand-white">
        {slide.title && (
          <h1 className="max-w-2xl text-4xl font-extrabold sm:text-5xl">{slide.title}</h1>
        )}
        {slide.body && (
          <p className="mt-4 max-w-xl text-lg text-white/90">{slide.body}</p>
        )}
        <a
          href="#inventory"
          className="mt-8 rounded-md bg-brand-red px-6 py-3 text-sm font-semibold transition hover:bg-brand-red-dark"
        >
          View Available Vehicles
        </a>
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-brand-red" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
