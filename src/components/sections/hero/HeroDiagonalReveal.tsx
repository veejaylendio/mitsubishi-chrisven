"use client";

import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

const PHOTO_CLIP = "polygon(30% 0, 100% 0, 100% 100%, 8% 100%)";
const EDGE_CLIP = "polygon(30% 0, 32.6% 0, 10.6% 100%, 8% 100%)";

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
      <div className="absolute inset-0" style={{ clipPath: PHOTO_CLIP }}>
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
        className="absolute inset-0 bg-gradient-to-b from-brand-red to-brand-red-dark"
        style={{ clipPath: EDGE_CLIP }}
      />

      <div className="relative z-10 flex h-full flex-col justify-center px-8 text-brand-white sm:px-16">
        {slide.title && (
          <h1 className="max-w-sm text-4xl font-extrabold uppercase leading-[0.95] sm:max-w-md sm:text-6xl">
            {slide.title}
          </h1>
        )}
        {slide.subtitle && (
          <p className="mt-3 max-w-sm text-lg font-medium text-white/95">{slide.subtitle}</p>
        )}
        {slide.body && <p className="mt-4 max-w-sm text-base text-white/90">{slide.body}</p>}

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
