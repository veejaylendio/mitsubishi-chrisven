"use client";

import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

const ALIGN_CLASS = {
  left: "items-start text-left",
  center: "items-start text-left",
  right: "items-start text-left",
} as const;

/** Split hero shows a single featured slide — no carousel rotation. */
export default function HeroSplit({ slides }: { slides: HeroSlide[] }) {
  if (slides.length === 0) return null;
  const slide = slides[0];

  return (
    <section className="grid min-h-[520px] w-full grid-cols-1 bg-brand-black md:grid-cols-2">
      <div
        className={`flex flex-col justify-center px-8 py-16 text-brand-white sm:px-16 ${ALIGN_CLASS[slide.text_align] ?? ALIGN_CLASS.left}`}
      >
        {slide.title && (
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">
            {slide.title}
          </h1>
        )}
        {slide.subtitle && (
          <p className="mt-3 max-w-lg text-lg font-medium text-white/95">{slide.subtitle}</p>
        )}
        {slide.body && <p className="mt-4 max-w-lg text-base text-white/90">{slide.body}</p>}

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

      <div className="relative min-h-[320px]">
        {slide.image_url && (
          <LazyImage
            src={slide.image_url}
            alt={slide.title ?? ""}
            wrapperClassName="absolute inset-0 h-full w-full"
            lcp
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"
          style={{ opacity: slide.overlay_opacity }}
        />
      </div>
    </section>
  );
}
