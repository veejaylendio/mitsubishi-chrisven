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
