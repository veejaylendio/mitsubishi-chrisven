"use client";

import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

/** Centered heading over a framed, inset media block — a calmer, showroom-placard hero. */
export default function HeroFramedMedia({
  slides,
  compact = false,
}: {
  slides: HeroSlide[];
  compact?: boolean;
}) {
  if (slides.length === 0) return null;
  const slide = slides[0];

  return (
    <section
      className={`flex w-full flex-col items-center bg-brand-black px-6 pb-10 pt-14 text-center text-brand-white sm:px-12 ${compact ? "min-h-[480px]" : "min-h-[640px]"}`}
    >
      <div className="max-w-2xl">
        {slide.title && (
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">{slide.title}</h1>
        )}
        {slide.subtitle && (
          <p className="mt-3 text-lg font-medium text-white/95">{slide.subtitle}</p>
        )}
        {slide.body && <p className="mt-3 max-w-xl text-sm text-white/80">{slide.body}</p>}
      </div>

      <div className="relative mt-8 w-full max-w-4xl flex-1 overflow-hidden rounded-2xl border border-white/15">
        {slide.media_type === "video" && slide.video_url ? (
          <video
            src={slide.video_url}
            poster={slide.image_url ?? undefined}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          slide.image_url && (
            <LazyImage
              src={slide.image_url}
              alt={slide.title ?? ""}
              wrapperClassName="absolute inset-0 h-full w-full"
              lcp
            />
          )
        )}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: slide.overlay_opacity * 0.5 }}
        />
      </div>

      {slide.buttons.length > 0 ? (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {slide.buttons.map((button, i) => (
            <CtaButtonLink key={`${button.label}-${i}`} button={button} />
          ))}
        </div>
      ) : (
        <a
          href="#inventory"
          className="mt-8 border border-white px-6 py-3 text-sm font-semibold tracking-wide transition hover:bg-white hover:text-brand-black"
        >
          VIEW AVAILABLE VEHICLES
        </a>
      )}
    </section>
  );
}
