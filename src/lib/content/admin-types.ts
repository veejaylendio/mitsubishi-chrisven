import type { CtaButton, HeroMediaType, TextAlign } from "@/lib/types";

export type AdminHeroSlide = {
  id: string;
  title: string | null;
  body: string | null;
  subtitle: string | null;
  image_url: string | null;
  video_url: string | null;
  media_type: HeroMediaType;
  buttons: CtaButton[];
  text_align: TextAlign;
  overlay_opacity: number;
  is_active: boolean;
  sort_order: number;
};

export type AdminVehicleImage = {
  id: string;
  vehicle_id: string;
  color_variant: string | null;
  image_url: string;
  hex_color: string | null;
  is_primary: boolean;
  sort_order: number;
};

export type AdminVehicle = {
  id: string;
  name: string;
  trim: string | null;
  price: number | null;
  description: string | null;
  badge: string | null;
  mileage: number | null;
  year: number | null;
  fuel_type: string | null;
  is_available: boolean;
  is_archived: boolean;
  is_comparable: boolean;
  sort_order: number;
  images: AdminVehicleImage[];
};

export type AdminReview = {
  id: string;
  author_name: string;
  rating: number | null;
  body: string | null;
  reviewer_photo_url: string | null;
  source_platform: string | null;
  is_featured: boolean;
  is_anonymous: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type AdminClientPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
  client_name: string | null;
  vehicle_model: string | null;
  delivery_date: string | null;
  quote: string | null;
  branch: string | null;
  consent_confirmed: boolean;
  is_archived: boolean;
  sort_order: number;
};
