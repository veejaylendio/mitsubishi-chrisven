import type { ComponentType } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSplit from "@/components/sections/hero/HeroSplit";
import VehicleCarousel from "@/components/VehicleCarousel";
import VehicleBento from "@/components/sections/vehicles/VehicleBento";
import ReviewsSection from "@/components/ReviewsSection";
import ReviewsCarousel from "@/components/sections/reviews/ReviewsCarousel";
import ClientsGallery from "@/components/ClientsGallery";
import ClientsCarousel from "@/components/sections/clients/ClientsCarousel";
import type { ClientPhoto, HeroSlide, Review, VehicleGroup } from "@/lib/types";

export const HERO_VARIANTS = {
  classic_centered: HeroCarousel,
  split: HeroSplit,
} satisfies Record<string, ComponentType<{ slides: HeroSlide[] }>>;

export const VEHICLES_VARIANTS = {
  carousel: VehicleCarousel,
  bento: VehicleBento,
} satisfies Record<string, ComponentType<{ groups: VehicleGroup[] }>>;

export const REVIEWS_VARIANTS = {
  grid_masonry: ReviewsSection,
  carousel: ReviewsCarousel,
} satisfies Record<string, ComponentType<{ reviews: Review[] }>>;

export const CLIENTS_VARIANTS = {
  grid_masonry: ClientsGallery,
  carousel: ClientsCarousel,
} satisfies Record<string, ComponentType<{ photos: ClientPhoto[] }>>;

export const DEFAULT_VARIANT = {
  hero: "classic_centered",
  vehicles: "carousel",
  reviews: "grid_masonry",
  clients: "grid_masonry",
} as const;

export type VariantOption = { key: string; label: string; implemented: boolean };

/** Full set of variants named in the spec. `implemented: false` = picker shows it as "Coming soon". */
export const VARIANT_CATALOG: Record<"hero" | "vehicles" | "reviews" | "clients", VariantOption[]> = {
  hero: [
    { key: "classic_centered", label: "Classic Centered", implemented: true },
    { key: "split", label: "Split Layout", implemented: true },
    { key: "slideshow", label: "Slideshow / Carousel Hero", implemented: false },
    { key: "video_overlay", label: "Video Hero with Overlay", implemented: false },
  ],
  vehicles: [
    { key: "carousel", label: "Carousel", implemented: true },
    { key: "bento", label: "Bento Grid", implemented: true },
    { key: "table", label: "Table View", implemented: false },
    { key: "card_grid_filters", label: "Card Grid with Quick Filters", implemented: false },
  ],
  reviews: [
    { key: "grid_masonry", label: "Grid / Masonry", implemented: true },
    { key: "carousel", label: "Carousel / Slider", implemented: true },
    { key: "bento", label: "Bento", implemented: false },
    { key: "video_spotlight", label: "Video Testimonial Spotlight", implemented: false },
    { key: "stat_combo", label: "Stat + Review Combo", implemented: false },
  ],
  clients: [
    { key: "grid_masonry", label: "Grid / Masonry", implemented: true },
    { key: "carousel", label: "Carousel / Slider", implemented: true },
    { key: "bento", label: "Bento Grid", implemented: false },
    { key: "polaroid", label: "Polaroid / Scrapbook Wall", implemented: false },
    { key: "story_card", label: "Before/Story Card", implemented: false },
    { key: "map", label: "Map / Location Wall", implemented: false },
  ],
};
