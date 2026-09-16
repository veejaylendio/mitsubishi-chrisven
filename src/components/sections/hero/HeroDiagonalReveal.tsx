"use client";

import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

// Desktop keeps the diagonal photo/black-panel split. A fixed-percentage
// diagonal doesn't scale down to phone widths — the clear text zone it leaves
// shrinks to almost nothing — so mobile drops the cut entirely and goes
// full-bleed with a bottom scrim instead; the red diagonal shows up as a
// small angled accent under the headline rather than a full-height divider.
const DESKTOP_PHOTO_CLIP = "sm:[clip-path:polygon(30%_0,100%_0,100%_100%,8%_100%)]";
const DESKTOP_EDGE_CLIP = "sm:[clip-path:polygon(30%_0,32.6%_0,10.6%_100%,8%_100%)]";

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
      <div className={`absolute inset-0 ${DESKTOP_PHOTO_CLIP}`}>
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

      {/* Bottom scrim for legibility on the mobile full-bleed layout; desktop has its own black panel instead. */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/70 to-transparent sm:hidden" />

      <div
        className={`absolute inset-0 hidden bg-gradient-to-b from-brand-red to-brand-red-dark sm:block ${DESKTOP_EDGE_CLIP}`}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col px-6 pb-10 text-brand-white sm:relative sm:inset-auto sm:h-full sm:justify-center sm:px-16 sm:pb-0">
        {slide.title && (
          <h1 className="max-w-sm text-4xl font-extrabold uppercase leading-[0.95] sm:max-w-md sm:text-6xl">
            {slide.title}
          </h1>
        )}

        {/* Small angled accent — the diagonal motif reinterpreted as a mark instead of a full-height cut. Desktop already gets the divider above. */}
        <div className="mt-3 h-1 w-7 -skew-x-[20deg] bg-brand-red sm:hidden" />

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
