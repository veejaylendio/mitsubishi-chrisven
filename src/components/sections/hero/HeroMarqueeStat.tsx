"use client";

import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

/**
 * Oversized outlined headline layered over the photo. There's no dedicated
 * stats field in the data model, so `body` doubles as a bottom ticker bar
 * instead of literal stat cells.
 */
export default function HeroMarqueeStat({
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
      className={`relative w-full overflow-hidden bg-brand-black ${compact ? "h-[480px]" : "h-[calc(100vh-5rem)] min-h-[520px]"}`}
    >
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
      <div className="absolute inset-0 bg-black" style={{ opacity: slide.overlay_opacity }} />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-16">
        {slide.title && (
          <h1
            className="max-w-4xl text-6xl font-extrabold uppercase leading-[0.9] tracking-tight text-white/10 sm:text-8xl"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.9)" }}
          >
            {slide.title}
          </h1>
        )}
        {slide.subtitle && (
          <p className="mt-4 max-w-lg text-lg font-medium text-white sm:text-xl">
            {slide.subtitle}
          </p>
        )}

        {slide.buttons.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {slide.buttons.map((button, i) => (
              <CtaButtonLink key={`${button.label}-${i}`} button={button} />
            ))}
          </div>
        ) : (
          <a
            href="#inventory"
            className="mt-6 w-fit border border-white px-6 py-3 text-sm font-semibold tracking-wide transition hover:bg-white hover:text-brand-black"
          >
            VIEW AVAILABLE VEHICLES
          </a>
        )}
      </div>

      {slide.body && (
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-black/40 px-6 py-3 text-center text-xs font-medium uppercase tracking-widest text-white/85 sm:px-16 sm:text-sm">
          {slide.body}
        </div>
      )}
    </section>
  );
}
