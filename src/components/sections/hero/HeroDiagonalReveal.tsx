"use client";

import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

// The diagonal cut is a fixed percentage of width, so the clear text zone it
// leaves shrinks to almost nothing on narrow phone screens. Mobile gets its
// own, much wider cut; sm: and up restores the original desktop framing.
const PHOTO_CLIP =
  "[clip-path:polygon(62%_0,100%_0,100%_100%,40%_100%)] sm:[clip-path:polygon(30%_0,100%_0,100%_100%,8%_100%)]";
const EDGE_CLIP =
  "[clip-path:polygon(62%_0,64.6%_0,42.6%_100%,40%_100%)] sm:[clip-path:polygon(30%_0,32.6%_0,10.6%_100%,8%_100%)]";

/** Full-bleed photo cut by a diagonal edge; copy sits in the clear zone left of the cut. */
export default function HeroDiagonalReveal({
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
      <div className={`absolute inset-0 ${PHOTO_CLIP}`}>
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
      </div>
      <div
        className={`absolute inset-0 bg-gradient-to-b from-brand-red to-brand-red-dark ${EDGE_CLIP}`}
      />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 text-brand-white sm:px-16">
        {slide.title && (
          <h1 className="max-w-[150px] text-2xl font-extrabold uppercase leading-[0.95] sm:max-w-md sm:text-6xl">
            {slide.title}
          </h1>
        )}
        {slide.subtitle && (
          <p className="mt-3 max-w-[150px] text-sm font-medium text-white/95 sm:max-w-sm sm:text-lg">
            {slide.subtitle}
          </p>
        )}
        {slide.body && (
          <p className="mt-4 max-w-[150px] text-sm text-white/90 sm:max-w-sm sm:text-base">
            {slide.body}
          </p>
        )}

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
    </section>
  );
}
