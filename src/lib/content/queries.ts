import { createClient } from "@/lib/supabase/server";
import type {
  BankRate,
  ClientPhoto,
  CtaButton,
  HeroSlide,
  PageProfile,
  PageSection,
  Review,
  VehicleGroup,
  VehicleOption,
  VehiclePriceOption,
  VehicleTrim,
} from "@/lib/types";

export async function getActiveProfile(): Promise<PageProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_profiles")
    .select("id, name, slug, status, scheduled_publish_at, typography, created_at, updated_at")
    .eq("status", "active")
    .maybeSingle();
  return (data as PageProfile) ?? null;
}

export async function getSectionsForProfile(profileId: string): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_sections")
    .select("id, profile_id, section_key, is_visible, sort_order, layout_variant, settings")
    .eq("profile_id", profileId)
    .order("sort_order");
  return (data as PageSection[]) ?? [];
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("landing_content")
    .select(
      "id, title, body, subtitle, image_url, video_url, media_type, buttons, text_align, overlay_opacity",
    )
    .eq("section", "hero_slide")
    .eq("is_active", true)
    .order("sort_order");

  return (data ?? []).map((row) => ({
    ...row,
    buttons: (row.buttons as CtaButton[] | null) ?? [],
  })) as HeroSlide[];
}

export async function getVehicleGroups(): Promise<VehicleGroup[]> {
  const supabase = await createClient();
  const [{ data: vehicles }, { data: vehicleImages }] = await Promise.all([
    supabase
      .from("vehicles")
      .select(
        "id, name, trim, price, description, badge, mileage, year, fuel_type, is_comparable",
      )
      .eq("is_available", true)
      .eq("is_archived", false)
      .order("sort_order"),
    supabase
      .from("vehicle_images")
      .select("vehicle_id, color_variant, image_url, hex_color, is_primary, sort_order")
      .order("sort_order"),
  ]);

  const groups: Record<string, VehicleGroup> = {};
  for (const vehicle of vehicles ?? []) {
    const { name, ...rest } = vehicle;
    const trim: VehicleTrim = {
      ...rest,
      images: (vehicleImages ?? []).filter((img) => img.vehicle_id === vehicle.id),
    };
    groups[name] ??= { name, trims: [] };
    groups[name].trims.push(trim);
  }

  return Object.values(groups);
}

export async function getVehicleOptions(): Promise<VehicleOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select("id, name, trim, year")
    .eq("is_available", true)
    .eq("is_archived", false)
    .order("sort_order");
  return (data as VehicleOption[]) ?? [];
}

export async function getVehiclePriceOptions(): Promise<VehiclePriceOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select("id, name, trim, year, price")
    .eq("is_available", true)
    .eq("is_archived", false)
    .order("sort_order");
  return (data as VehiclePriceOption[]) ?? [];
}

export async function getBankRates(): Promise<BankRate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bank_rates")
    .select("id, bank_name, interest_rate, min_term_months, max_term_months, notes, is_active")
    .eq("is_active", true)
    .order("interest_rate", { ascending: true });
  return (data as BankRate[]) ?? [];
}

export async function getReviews(): Promise<Review[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select(
      "id, author_name, rating, body, reviewer_photo_url, video_url, source_platform, is_featured, is_anonymous",
    )
    .eq("is_published", true)
    .order("sort_order");
  return (data as Review[]) ?? [];
}

export async function getClientPhotos(): Promise<ClientPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients_gallery")
    .select(
      "id, image_url, caption, client_name, vehicle_model, delivery_date, quote, branch, consent_confirmed",
    )
    .eq("is_archived", false)
    .order("sort_order");
  return (data as ClientPhoto[]) ?? [];
}
