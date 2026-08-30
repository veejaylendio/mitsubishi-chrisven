"use client";

import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

/** Full-bleed photo with a floating content card anchored over its lower-left corner. */
export default function HeroStackedCard({
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
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        style={{ opacity: slide.overlay_opacity }}
      />

      <div className="absolute inset-x-6 bottom-6 z-10 max-w-md border-l-4 border-brand-red bg-brand-black/85 px-6 py-6 text-brand-white backdrop-blur-sm sm:inset-x-auto sm:bottom-12 sm:left-12 sm:px-8 sm:py-8">
        {slide.title && (
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{slide.title}</h1>
        )}
        {slide.subtitle && (
          <p className="mt-3 text-base font-medium text-white/95">{slide.subtitle}</p>
        )}
        {slide.body && <p className="mt-3 text-sm text-white/85">{slide.body}</p>}

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
    </section>
  );
}
