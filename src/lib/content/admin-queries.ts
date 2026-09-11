import { createClient } from "@/lib/supabase/server";
import type { PageProfile, PageSection } from "@/lib/types";
import type {
  AdminClientPhoto,
  AdminHeroSlide,
  AdminReview,
  AdminVehicle,
} from "./admin-types";

export async function getAllProfiles(): Promise<PageProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_profiles")
    .select("id, name, slug, status, scheduled_publish_at, typography, created_at, updated_at")
    .order("created_at");
  return (data as PageProfile[]) ?? [];
}

export async function getProfileById(profileId: string): Promise<PageProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_profiles")
    .select("id, name, slug, status, scheduled_publish_at, typography, created_at, updated_at")
    .eq("id", profileId)
    .maybeSingle();
  return (data as PageProfile) ?? null;
}

export async function getSectionsForProfileAdmin(profileId: string): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_sections")
    .select("id, profile_id, section_key, is_visible, sort_order, layout_variant, settings")
    .eq("profile_id", profileId)
    .order("sort_order");
  return (data as PageSection[]) ?? [];
}

export async function getDueScheduledProfiles(): Promise<PageProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_profiles")
    .select("id, name, slug, status, scheduled_publish_at, typography, created_at, updated_at")
    .eq("status", "scheduled")
    .lte("scheduled_publish_at", new Date().toISOString());
  return (data as PageProfile[]) ?? [];
}

export async function getVersionsForProfile(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_profile_versions")
    .select("id, profile_id, snapshot, label, published_at, published_by")
    .eq("profile_id", profileId)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getAllHeroSlidesAdmin(): Promise<AdminHeroSlide[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("landing_content")
    .select(
      "id, title, body, subtitle, image_url, video_url, media_type, buttons, text_align, overlay_opacity, is_active, sort_order",
    )
    .eq("section", "hero_slide")
    .order("sort_order");
  return (data as AdminHeroSlide[]) ?? [];
}

export async function getAllVehiclesAdmin(): Promise<AdminVehicle[]> {
  const supabase = await createClient();
  const [{ data: vehicles }, { data: images }] = await Promise.all([
    supabase
      .from("vehicles")
      .select(
        "id, name, trim, price, discount, description, badge, mileage, year, fuel_type, is_available, is_archived, is_comparable, sort_order",
      )
      .order("sort_order"),
    supabase
      .from("vehicle_images")
      .select("id, vehicle_id, color_variant, image_url, hex_color, is_primary, sort_order")
      .order("sort_order"),
  ]);

  return (vehicles ?? []).map((vehicle) => ({
    ...vehicle,
    images: (images ?? []).filter((img) => img.vehicle_id === vehicle.id),
  }));
}

export async function getAllReviewsAdmin(): Promise<AdminReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select(
      "id, author_name, rating, body, reviewer_photo_url, video_url, source_platform, is_featured, is_anonymous, is_published, sort_order, created_at",
    )
    .order("sort_order");
  return (data as AdminReview[]) ?? [];
}

export async function getAllClientPhotosAdmin(): Promise<AdminClientPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients_gallery")
    .select(
      "id, image_url, caption, client_name, vehicle_model, delivery_date, quote, branch, consent_confirmed, is_archived, sort_order",
    )
    .order("sort_order");
  return (data as AdminClientPhoto[]) ?? [];
}
