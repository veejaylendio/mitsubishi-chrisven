import LazyImage from "@/components/LazyImage";
import CtaButtonLink from "@/components/CtaButtonLink";
import type { HeroSlide } from "@/lib/types";

/**
 * Cinematic single-moment hero: full-bleed looping video (or image fallback),
 * center-anchored text, heavier full-coverage overlay. No carousel controls —
 * intended for one strong promotional moment rather than rotating slides.
 */
export default function HeroVideoOverlay({ slides }: { slides: HeroSlide[] }) {
  if (slides.length === 0) return null;
  const slide = slides[0];

  return (
    <section className="relative flex h-[calc(100vh-5rem)] min-h-[520px] w-full items-center justify-center overflow-hidden bg-brand-black">
      {slide.video_url ? (
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
        style={{ opacity: Math.max(slide.overlay_opacity, 0.5) }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center text-brand-white">
        {slide.title && (
          <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-wide sm:text-5xl">
            {slide.title}
          </h1>
        )}
        {slide.subtitle && <p className="mt-4 text-lg text-white/95">{slide.subtitle}</p>}
        {slide.body && <p className="mt-3 text-sm text-white/80">{slide.body}</p>}
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
      </div>
    </section>
  );
}
