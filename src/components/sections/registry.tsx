import type { ComponentType } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSlideshow from "@/components/sections/hero/HeroSlideshow";
import HeroVideoOverlay from "@/components/sections/hero/HeroVideoOverlay";
import HeroDiagonalReveal from "@/components/sections/hero/HeroDiagonalReveal";
import HeroStackedCard from "@/components/sections/hero/HeroStackedCard";
import HeroFramedMedia from "@/components/sections/hero/HeroFramedMedia";
import HeroMarqueeStat from "@/components/sections/hero/HeroMarqueeStat";
import VehicleCarousel from "@/components/VehicleCarousel";
import VehicleTable from "@/components/sections/vehicles/VehicleTable";
import VehicleSpotlightGrid from "@/components/sections/vehicles/VehicleSpotlightGrid";
import VehicleShowcaseRows from "@/components/sections/vehicles/VehicleShowcaseRows";
import VehicleCompareGrid from "@/components/sections/vehicles/VehicleCompareGrid";
import VehicleSidebarFilters from "@/components/sections/vehicles/VehicleSidebarFilters";
import VehicleToolbarFilters from "@/components/sections/vehicles/VehicleToolbarFilters";
import VehicleSegmentedTabs from "@/components/sections/vehicles/VehicleSegmentedTabs";
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
  slideshow: HeroSlideshow,
  video_overlay: HeroVideoOverlay,
  diagonal_reveal: HeroDiagonalReveal,
  stacked_card: HeroStackedCard,
  framed_media: HeroFramedMedia,
  marquee_stat: HeroMarqueeStat,
} satisfies Record<string, ComponentType<{ slides: HeroSlide[]; compact?: boolean }>>;

export const VEHICLES_VARIANTS = {
  carousel: VehicleCarousel,
  table: VehicleTable,
  spotlight_grid: VehicleSpotlightGrid,
  showcase_rows: VehicleShowcaseRows,
  compare_grid: VehicleCompareGrid,
  sidebar_filters: VehicleSidebarFilters,
  toolbar_filters: VehicleToolbarFilters,
  segmented_tabs: VehicleSegmentedTabs,
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
    { key: "slideshow", label: "Slideshow / Carousel Hero", implemented: true },
    { key: "video_overlay", label: "Video Hero with Overlay", implemented: true },
    { key: "diagonal_reveal", label: "Diagonal Reveal", implemented: true },
    { key: "stacked_card", label: "Stacked Card", implemented: true },
    { key: "framed_media", label: "Framed Media", implemented: true },
    { key: "marquee_stat", label: "Marquee Stat", implemented: true },
  ],
  vehicles: [
    { key: "carousel", label: "Carousel", implemented: true },
    { key: "table", label: "Table View", implemented: true },
    { key: "spotlight_grid", label: "Spotlight + Grid", implemented: true },
    { key: "showcase_rows", label: "Alternating Showcase Rows", implemented: true },
    { key: "compare_grid", label: "Compare Grid", implemented: true },
    { key: "sidebar_filters", label: "Sidebar Filters", implemented: true },
    { key: "toolbar_filters", label: "Toolbar + Filter Popover", implemented: true },
    { key: "segmented_tabs", label: "Segmented Trim Tabs", implemented: true },
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
