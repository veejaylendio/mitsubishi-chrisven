"use client";

import { useCanvasStore } from "../store";
import {
  HERO_VARIANTS,
  VEHICLES_VARIANTS,
  REVIEWS_VARIANTS,
  CLIENTS_VARIANTS,
  DEFAULT_VARIANT,
} from "@/components/sections/registry";
import type { ClientPhoto, HeroSlide, Review, VehicleGroup } from "@/lib/types";
import { resolveSectionTypography, typographyToCssVars } from "@/lib/typography";

export default function PreviewPane({
  heroSlides,
  vehicleGroups,
  reviews,
  clientPhotos,
  onExitFullPreview,
}: {
  heroSlides: HeroSlide[];
  vehicleGroups: VehicleGroup[];
  reviews: Review[];
  clientPhotos: ClientPhoto[];
  /** When provided, the header shows an "Exit preview" button instead of the "Live preview" label. */
  onExitFullPreview?: () => void;
}) {
  const sections = useCanvasStore((s) => s.sections);
  const typography = useCanvasStore((s) => s.typography);
  const previewMode = useCanvasStore((s) => s.previewMode);
  const setPreviewMode = useCanvasStore((s) => s.setPreviewMode);

  const ordered = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        {onExitFullPreview ? (
          <button
            type="button"
            onClick={onExitFullPreview}
            className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Exit preview
          </button>
        ) : (
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Live preview</p>
        )}
        <div className="flex gap-1 rounded-md bg-gray-100 p-1">
          {(["desktop", "mobile"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPreviewMode(mode)}
              className={`rounded px-3 py-1 text-xs font-medium capitalize ${
                previewMode === mode ? "bg-white text-brand-black shadow-sm" : "text-gray-500"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <div
          className={`mx-auto overflow-hidden rounded-lg bg-white shadow-lg transition-all ${
            previewMode === "mobile" ? "max-w-sm" : "max-w-full"
          }`}
          style={typographyToCssVars(typography)}
        >
          {ordered
            .filter((s) => s.is_visible)
            .map((section) => {
              const sectionStyle = typographyToCssVars(
                resolveSectionTypography(typography, section.section_key),
              );
              switch (section.section_key) {
                case "hero": {
                  const Hero =
                    HERO_VARIANTS[section.layout_variant as keyof typeof HERO_VARIANTS] ??
                    HERO_VARIANTS[DEFAULT_VARIANT.hero];
                  return (
                    <div key={section.section_key} style={sectionStyle}>
                      <Hero slides={heroSlides} compact />
                    </div>
                  );
                }
                case "vehicles": {
                  const Vehicles =
                    VEHICLES_VARIANTS[section.layout_variant as keyof typeof VEHICLES_VARIANTS] ??
                    VEHICLES_VARIANTS[DEFAULT_VARIANT.vehicles];
                  return (
                    <section key={section.section_key} className="py-10" style={sectionStyle}>
                      <h2 className="text-center text-xl font-bold text-brand-black">
                        Available Vehicles
                      </h2>
                      <div className="mt-6">
                        <Vehicles groups={vehicleGroups} />
                      </div>
                    </section>
                  );
                }
                case "reviews": {
                  const Reviews =
                    REVIEWS_VARIANTS[section.layout_variant as keyof typeof REVIEWS_VARIANTS] ??
                    REVIEWS_VARIANTS[DEFAULT_VARIANT.reviews];
                  return (
                    <div key={section.section_key} style={sectionStyle}>
                      <Reviews reviews={reviews} />
                    </div>
                  );
                }
                case "clients": {
                  const Clients =
                    CLIENTS_VARIANTS[section.layout_variant as keyof typeof CLIENTS_VARIANTS] ??
                    CLIENTS_VARIANTS[DEFAULT_VARIANT.clients];
                  return (
                    <div key={section.section_key} style={sectionStyle}>
                      <Clients photos={clientPhotos} />
                    </div>
                  );
                }
                default:
                  return null;
              }
            })}
          {ordered.every((s) => !s.is_visible) && (
            <p className="p-10 text-center text-sm text-gray-400">
              Every section is hidden — the public page would be empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
