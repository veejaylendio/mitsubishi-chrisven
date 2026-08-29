import type { ComponentType } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSplit from "@/components/sections/hero/HeroSplit";
import HeroSlideshow from "@/components/sections/hero/HeroSlideshow";
import HeroVideoOverlay from "@/components/sections/hero/HeroVideoOverlay";
import VehicleCarousel from "@/components/VehicleCarousel";
import VehicleBento from "@/components/sections/vehicles/VehicleBento";
import VehicleTable from "@/components/sections/vehicles/VehicleTable";
import VehicleCardGridFilters from "@/components/sections/vehicles/VehicleCardGridFilters";
import ReviewsSection from "@/components/ReviewsSection";
import ReviewsCarousel from "@/components/sections/reviews/ReviewsCarousel";
import ReviewsBento from "@/components/sections/reviews/ReviewsBento";
import ReviewsVideoSpotlight from "@/components/sections/reviews/ReviewsVideoSpotlight";
import ReviewsStatCombo from "@/components/sections/reviews/ReviewsStatCombo";
import ClientsGallery from "@/components/ClientsGallery";
import ClientsCarousel from "@/components/sections/clients/ClientsCarousel";
import ClientsBento from "@/components/sections/clients/ClientsBento";
import ClientsPolaroid from "@/components/sections/clients/ClientsPolaroid";
import ClientsStoryCard from "@/components/sections/clients/ClientsStoryCard";
import ClientsMap from "@/components/sections/clients/ClientsMap";
import type { ClientPhoto, HeroSlide, Review, VehicleGroup } from "@/lib/types";

export const HERO_VARIANTS = {
  classic_centered: HeroCarousel,
  split: HeroSplit,
  slideshow: HeroSlideshow,
  video_overlay: HeroVideoOverlay,
} satisfies Record<string, ComponentType<{ slides: HeroSlide[]; compact?: boolean }>>;

export const VEHICLES_VARIANTS = {
  carousel: VehicleCarousel,
  bento: VehicleBento,
  table: VehicleTable,
  card_grid_filters: VehicleCardGridFilters,
} satisfies Record<string, ComponentType<{ groups: VehicleGroup[] }>>;

export const REVIEWS_VARIANTS = {
  grid_masonry: ReviewsSection,
  carousel: ReviewsCarousel,
  bento: ReviewsBento,
  video_spotlight: ReviewsVideoSpotlight,
  stat_combo: ReviewsStatCombo,
} satisfies Record<string, ComponentType<{ reviews: Review[] }>>;

export const CLIENTS_VARIANTS = {
  grid_masonry: ClientsGallery,
  carousel: ClientsCarousel,
  bento: ClientsBento,
  polaroid: ClientsPolaroid,
  story_card: ClientsStoryCard,
  map: ClientsMap,
} satisfies Record<string, ComponentType<{ photos: ClientPhoto[] }>>;

export const DEFAULT_VARIANT = {
  hero: "classic_centered",
  vehicles: "carousel",
  reviews: "grid_masonry",
  clients: "grid_masonry",
} as const;

export type VariantOption = { key: string; label: string; implemented: boolean };

/** Full set of variants named in the spec — all implemented now. */
export const VARIANT_CATALOG: Record<"hero" | "vehicles" | "reviews" | "clients", VariantOption[]> = {
  hero: [
    { key: "classic_centered", label: "Classic Centered", implemented: true },
    { key: "split", label: "Split Layout", implemented: true },
    { key: "slideshow", label: "Slideshow / Carousel Hero", implemented: true },
    { key: "video_overlay", label: "Video Hero with Overlay", implemented: true },
  ],
  vehicles: [
    { key: "carousel", label: "Carousel", implemented: true },
    { key: "bento", label: "Bento Grid", implemented: true },
    { key: "table", label: "Table View", implemented: true },
    { key: "card_grid_filters", label: "Card Grid with Quick Filters", implemented: true },
  ],
  reviews: [
    { key: "grid_masonry", label: "Grid / Masonry", implemented: true },
    { key: "carousel", label: "Carousel / Slider", implemented: true },
    { key: "bento", label: "Bento", implemented: true },
    { key: "video_spotlight", label: "Video Testimonial Spotlight", implemented: true },
    { key: "stat_combo", label: "Stat + Review Combo", implemented: true },
  ],
  clients: [
    { key: "grid_masonry", label: "Grid / Masonry", implemented: true },
    { key: "carousel", label: "Carousel / Slider", implemented: true },
    { key: "bento", label: "Bento Grid", implemented: true },
    { key: "polaroid", label: "Polaroid / Scrapbook Wall", implemented: true },
    { key: "story_card", label: "Before/Story Card", implemented: true },
    { key: "map", label: "Map / Location Wall", implemented: true },
  ],
};
