"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getPresignedUploadUrl, deleteImage, keyFromPublicUrl } from "@/lib/r2/storage";
import { publicUrlFor } from "@/lib/r2/client";
import type { TypographySettings } from "@/lib/types";
import {
  heroSlideSchema,
  vehicleSchema,
  reviewSchema,
  clientPhotoSchema,
  sectionDraftSchema,
  uploadRequestSchema,
} from "./schemas";
import { z } from "zod";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return { supabase, user };
}

function afterContentChange() {
  revalidatePath("/");
  revalidatePath("/dashboard/landing-content");
}

async function nextSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  filter?: { column: string; value: string },
) {
  let query = supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (filter) query = query.eq(filter.column, filter.value);
  const { data } = await query.maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

async function reorderRows(table: string, orderedIds: string[]) {
  const { supabase } = await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from(table).update({ sort_order: index }).eq("id", id),
    ),
  );
  afterContentChange();
}

/* ---------------------------------- Uploads ---------------------------------- */

export async function requestUploadUrl(input: z.infer<typeof uploadRequestSchema>) {
  await requireAdmin();
  const parsed = uploadRequestSchema.parse(input);

  const isVideo = VIDEO_TYPES.includes(parsed.contentType);
  const isImage = IMAGE_TYPES.includes(parsed.contentType);
  if (!isImage && !(isVideo && parsed.folder === "hero")) {
    throw new Error(`Unsupported file type: ${parsed.contentType}`);
  }
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (parsed.fileSize > maxBytes) {
    throw new Error(`File too large. Max ${Math.round(maxBytes / 1024 / 1024)}MB.`);
  }

  const safeName = parsed.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const key = `${parsed.folder}/${randomUUID()}-${safeName}`;
  const uploadUrl = await getPresignedUploadUrl(key, parsed.contentType);
  const publicUrl = publicUrlFor(key);
  return { uploadUrl, publicUrl };
}

/* ------------------------------- Hero slides ------------------------------- */

export async function createHeroSlide(input: z.infer<typeof heroSlideSchema>) {
  const { supabase } = await requireAdmin();
  const data = heroSlideSchema.parse(input);
  const sort_order = await nextSortOrder(supabase, "landing_content");
  const { error } = await supabase.from("landing_content").insert({
    section: "hero_slide",
    sort_order,
    ...data,
  });
  if (error) throw error;
  afterContentChange();
}

export async function updateHeroSlide(input: z.infer<typeof heroSlideSchema>) {
  const { supabase } = await requireAdmin();
  const data = heroSlideSchema.parse(input);
  if (!data.id) throw new Error("Missing hero slide id");
  const { id, ...rest } = data;
  const { error } = await supabase.from("landing_content").update(rest).eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function deleteHeroSlide(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("landing_content").delete().eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function reorderHeroSlides(orderedIds: string[]) {
  await reorderRows("landing_content", orderedIds);
}

/* --------------------------------- Vehicles --------------------------------- */

export async function createVehicle(input: z.infer<typeof vehicleSchema>) {
  const { supabase } = await requireAdmin();
  const data = vehicleSchema.parse(input);
  const sort_order = await nextSortOrder(supabase, "vehicles");
  const { data: created, error } = await supabase
    .from("vehicles")
    .insert({ ...data, sort_order, is_archived: false })
    .select("id")
    .single();
  if (error || !created) throw error;
  afterContentChange();
  return created.id as string;
}

export async function updateVehicle(input: z.infer<typeof vehicleSchema>) {
  const { supabase } = await requireAdmin();
  const data = vehicleSchema.parse(input);
  if (!data.id) throw new Error("Missing vehicle id");
  const { id, ...rest } = data;
  const { error } = await supabase.from("vehicles").update(rest).eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function archiveVehicle(id: string, archived: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("vehicles").update({ is_archived: archived }).eq("id", id);
  if (error) throw error;
  afterContentChange();
}

async function deleteVehicleImagesFor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  vehicleId: string,
) {
  const { data: images } = await supabase
    .from("vehicle_images")
    .select("id, image_url")
    .eq("vehicle_id", vehicleId);
  await Promise.all(
    (images ?? []).map(async (img) => {
      const key = keyFromPublicUrl(img.image_url);
      if (key) await deleteImage(key).catch(() => {});
    }),
  );
  await supabase.from("vehicle_images").delete().eq("vehicle_id", vehicleId);
}

export async function deleteVehicle(id: string) {
  const { supabase } = await requireAdmin();
  await deleteVehicleImagesFor(supabase, id);
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function duplicateVehicle(id: string) {
  const { supabase } = await requireAdmin();
  const { data: original, error } = await supabase
    .from("vehicles")
    .select(
      "name, trim, price, description, badge, mileage, year, fuel_type, is_available, is_comparable, is_archived",
    )
    .eq("id", id)
    .single();
  if (error || !original) throw error ?? new Error("Vehicle not found");

  const sort_order = await nextSortOrder(supabase, "vehicles");
  const { data: copy, error: insertError } = await supabase
    .from("vehicles")
    .insert({ ...original, name: `${original.name} (Copy)`, sort_order })
    .select("id")
    .single();
  if (insertError || !copy) throw insertError;

  const { data: images } = await supabase
    .from("vehicle_images")
    .select("color_variant, image_url, hex_color, is_primary, sort_order")
    .eq("vehicle_id", id);
  if (images && images.length > 0) {
    await supabase
      .from("vehicle_images")
      .insert(images.map((img) => ({ ...img, vehicle_id: copy.id })));
  }
  afterContentChange();
}

export async function reorderVehicles(orderedIds: string[]) {
  await reorderRows("vehicles", orderedIds);
}

export async function bulkUpdateVehicles(
  ids: string[],
  patch: { is_archived?: boolean; is_available?: boolean },
) {
  const { supabase } = await requireAdmin();
  await Promise.all(ids.map((id) => supabase.from("vehicles").update(patch).eq("id", id)));
  afterContentChange();
}

export async function bulkDeleteVehicles(ids: string[]) {
  const { supabase } = await requireAdmin();
  await Promise.all(ids.map((id) => deleteVehicleImagesFor(supabase, id)));
  const { error } = await supabase.from("vehicles").delete().in("id", ids);
  if (error) throw error;
  afterContentChange();
}

const vehicleImageInputSchema = z.object({
  image_url: z.string().min(1),
  color_variant: z.string().max(60).nullable(),
  hex_color: z.string().max(20).nullable(),
});

export async function addVehicleImage(
  vehicleId: string,
  input: z.infer<typeof vehicleImageInputSchema>,
) {
  const { supabase } = await requireAdmin();
  const data = vehicleImageInputSchema.parse(input);
  const sort_order = await nextSortOrder(supabase, "vehicle_images", {
    column: "vehicle_id",
    value: vehicleId,
  });
  const { error } = await supabase
    .from("vehicle_images")
    .insert({ ...data, vehicle_id: vehicleId, sort_order, is_primary: false });
  if (error) throw error;
  afterContentChange();
}

export async function deleteVehicleImage(imageId: string) {
  const { supabase } = await requireAdmin();
  const { data: image } = await supabase
    .from("vehicle_images")
    .select("image_url")
    .eq("id", imageId)
    .maybeSingle();
  if (image) {
    const key = keyFromPublicUrl(image.image_url);
    if (key) await deleteImage(key).catch(() => {});
  }
  const { error } = await supabase.from("vehicle_images").delete().eq("id", imageId);
  if (error) throw error;
  afterContentChange();
}

export async function setPrimaryVehicleImage(vehicleId: string, imageId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("vehicle_images").update({ is_primary: false }).eq("vehicle_id", vehicleId);
  const { error } = await supabase
    .from("vehicle_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  if (error) throw error;
  afterContentChange();
}

export async function reorderVehicleImages(orderedIds: string[]) {
  await reorderRows("vehicle_images", orderedIds);
}

/* --------------------------------- Reviews ---------------------------------- */

export async function createReview(input: z.infer<typeof reviewSchema>) {
  const { supabase } = await requireAdmin();
  const data = reviewSchema.parse(input);
  const sort_order = await nextSortOrder(supabase, "reviews");
  const { error } = await supabase.from("reviews").insert({ ...data, sort_order });
  if (error) throw error;
  afterContentChange();
}

export async function updateReview(input: z.infer<typeof reviewSchema>) {
  const { supabase } = await requireAdmin();
  const data = reviewSchema.parse(input);
  if (!data.id) throw new Error("Missing review id");
  const { id, ...rest } = data;
  const { error } = await supabase.from("reviews").update(rest).eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function deleteReview(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function reorderReviews(orderedIds: string[]) {
  await reorderRows("reviews", orderedIds);
}

export async function bulkUpdateReviews(
  ids: string[],
  patch: { is_published?: boolean; is_featured?: boolean },
) {
  const { supabase } = await requireAdmin();
  await Promise.all(ids.map((id) => supabase.from("reviews").update(patch).eq("id", id)));
  afterContentChange();
}

export async function bulkDeleteReviews(ids: string[]) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("reviews").delete().in("id", ids);
  if (error) throw error;
  afterContentChange();
}

/* ----------------------------- Client photos -------------------------------- */

export async function createClientPhoto(input: z.infer<typeof clientPhotoSchema>) {
  const { supabase } = await requireAdmin();
  const data = clientPhotoSchema.parse(input);
  const sort_order = await nextSortOrder(supabase, "clients_gallery");
  const { error } = await supabase
    .from("clients_gallery")
    .insert({ ...data, sort_order, is_archived: false });
  if (error) throw error;
  afterContentChange();
}

export async function updateClientPhoto(input: z.infer<typeof clientPhotoSchema>) {
  const { supabase } = await requireAdmin();
  const data = clientPhotoSchema.parse(input);
  if (!data.id) throw new Error("Missing client photo id");
  const { id, ...rest } = data;
  const { error } = await supabase.from("clients_gallery").update(rest).eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function archiveClientPhoto(id: string, archived: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("clients_gallery")
    .update({ is_archived: archived })
    .eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function deleteClientPhoto(id: string) {
  const { supabase } = await requireAdmin();
  const { data: photo } = await supabase
    .from("clients_gallery")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();
  if (photo) {
    const key = keyFromPublicUrl(photo.image_url);
    if (key) await deleteImage(key).catch(() => {});
  }
  const { error } = await supabase.from("clients_gallery").delete().eq("id", id);
  if (error) throw error;
  afterContentChange();
}

export async function reorderClientPhotos(orderedIds: string[]) {
  await reorderRows("clients_gallery", orderedIds);
}

export async function bulkUpdateClientPhotos(ids: string[], patch: { is_archived?: boolean }) {
  const { supabase } = await requireAdmin();
  await Promise.all(ids.map((id) => supabase.from("clients_gallery").update(patch).eq("id", id)));
  afterContentChange();
}

export async function bulkDeleteClientPhotos(ids: string[]) {
  const { supabase } = await requireAdmin();
  const { data: photos } = await supabase
    .from("clients_gallery")
    .select("image_url")
    .in("id", ids);
  await Promise.all(
    (photos ?? []).map(async (p) => {
      const key = keyFromPublicUrl(p.image_url);
      if (key) await deleteImage(key).catch(() => {});
    }),
  );
  const { error } = await supabase.from("clients_gallery").delete().in("id", ids);
  if (error) throw error;
  afterContentChange();
}

/* ------------------------- Sections / typography draft ----------------------- */

const saveDraftInputSchema = z.object({
  profileId: z.string(),
  sections: z.array(sectionDraftSchema),
  typography: z.custom<TypographySettings>(),
});

export async function saveDraftSections(input: z.infer<typeof saveDraftInputSchema>) {
  const { supabase } = await requireAdmin();
  const { profileId, sections, typography } = saveDraftInputSchema.parse(input);

  await Promise.all(
    sections.map((section) =>
      supabase.from("page_sections").upsert(
        { ...section, profile_id: profileId },
        { onConflict: "profile_id,section_key" },
      ),
    ),
  );

  const { error } = await supabase
    .from("page_profiles")
    .update({ typography })
    .eq("id", profileId);
  if (error) throw error;

  afterContentChange();
}

/* ------------------------------- Profiles ------------------------------------ */

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "profile"
  );
}

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  headingFont: "geist",
  bodyFont: "geist",
  headingWeight: "bold",
  bodyWeight: "regular",
  sizeScale: "medium",
  letterSpacing: "normal",
  textCase: "normal",
  sectionOverrides: {},
};

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string) {
  let slug = base;
  let n = 1;
  while (true) {
    const { data } = await supabase.from("page_profiles").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createProfile(name: string) {
  const { supabase } = await requireAdmin();
  const slug = await uniqueSlug(supabase, slugify(name));

  const { data: active } = await supabase
    .from("page_profiles")
    .select("id, typography")
    .eq("status", "active")
    .maybeSingle();

  const { data: profile, error } = await supabase
    .from("page_profiles")
    .insert({ name, slug, status: "draft", typography: active?.typography ?? DEFAULT_TYPOGRAPHY })
    .select("id")
    .single();
  if (error || !profile) throw error;

  const sourceSections = active
    ? (await supabase.from("page_sections").select("*").eq("profile_id", active.id)).data ?? []
    : [];

  const sectionRows =
    sourceSections.length > 0
      ? sourceSections.map((s) => ({
          profile_id: profile.id,
          section_key: s.section_key,
          is_visible: s.is_visible,
          sort_order: s.sort_order,
          layout_variant: s.layout_variant,
          settings: s.settings,
        }))
      : (["hero", "vehicles", "reviews", "clients"] as const).map((key, i) => ({
          profile_id: profile.id,
          section_key: key,
          is_visible: true,
          sort_order: i,
          layout_variant: { hero: "classic_centered", vehicles: "carousel", reviews: "grid_masonry", clients: "grid_masonry" }[key],
          settings: {},
        }));

  await supabase.from("page_sections").insert(sectionRows);
  afterContentChange();
  return profile.id as string;
}

export async function duplicateProfile(profileId: string, newName: string) {
  const { supabase } = await requireAdmin();
  const { data: source, error } = await supabase
    .from("page_profiles")
    .select("typography")
    .eq("id", profileId)
    .single();
  if (error || !source) throw error ?? new Error("Profile not found");

  const slug = await uniqueSlug(supabase, slugify(newName));
  const { data: profile, error: insertError } = await supabase
    .from("page_profiles")
    .insert({ name: newName, slug, status: "draft", typography: source.typography })
    .select("id")
    .single();
  if (insertError || !profile) throw insertError;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("section_key, is_visible, sort_order, layout_variant, settings")
    .eq("profile_id", profileId);

  if (sections && sections.length > 0) {
    await supabase
      .from("page_sections")
      .insert(sections.map((s) => ({ ...s, profile_id: profile.id })));
  }
  afterContentChange();
  return profile.id as string;
}

export async function renameProfile(profileId: string, name: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("page_profiles").update({ name }).eq("id", profileId);
  if (error) throw error;
  afterContentChange();
}

export async function deleteProfile(profileId: string) {
  const { supabase } = await requireAdmin();
  const { data: profile } = await supabase
    .from("page_profiles")
    .select("status")
    .eq("id", profileId)
    .maybeSingle();
  if (profile?.status === "active") {
    throw new Error("Cannot delete the active profile. Publish another profile first.");
  }
  const { error } = await supabase.from("page_profiles").delete().eq("id", profileId);
  if (error) throw error;
  afterContentChange();
}

async function snapshotProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  profileId: string,
) {
  const [{ data: profile }, { data: sections }] = await Promise.all([
    supabase.from("page_profiles").select("*").eq("id", profileId).single(),
    supabase.from("page_sections").select("*").eq("profile_id", profileId),
  ]);
  if (!profile) return null;
  return { profile, sections: sections ?? [] };
}

export async function publishProfile(profileId: string) {
  const { supabase, user } = await requireAdmin();

  const { data: target } = await supabase
    .from("page_profiles")
    .select("id, status, name")
    .eq("id", profileId)
    .maybeSingle();
  if (!target) throw new Error("Profile not found");
  if (target.status === "active") return;

  const { data: current } = await supabase
    .from("page_profiles")
    .select("id, name")
    .eq("status", "active")
    .maybeSingle();

  if (current) {
    const snapshot = await snapshotProfile(supabase, current.id);
    if (snapshot) {
      await supabase.from("page_profile_versions").insert({
        profile_id: current.id,
        snapshot,
        label: current.name,
        published_by: user.id,
      });
    }
    await supabase.from("page_profiles").update({ status: "draft" }).eq("id", current.id);
  }

  const { error } = await supabase
    .from("page_profiles")
    .update({ status: "active", scheduled_publish_at: null })
    .eq("id", profileId);
  if (error) throw error;

  afterContentChange();
}

export async function scheduleProfile(profileId: string, publishAt: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("page_profiles")
    .update({ status: "scheduled", scheduled_publish_at: publishAt })
    .eq("id", profileId);
  if (error) throw error;
  afterContentChange();
}

export async function unscheduleProfile(profileId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("page_profiles")
    .update({ status: "draft", scheduled_publish_at: null })
    .eq("id", profileId);
  if (error) throw error;
  afterContentChange();
}

export async function getVersions(profileId: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("page_profile_versions")
    .select("id, label, published_at")
    .eq("profile_id", profileId)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function restoreVersion(versionId: string) {
  const { supabase } = await requireAdmin();
  const { data: version, error } = await supabase
    .from("page_profile_versions")
    .select("profile_id, snapshot")
    .eq("id", versionId)
    .single();
  if (error || !version) throw error ?? new Error("Version not found");

  const snapshot = version.snapshot as {
    profile: { typography: TypographySettings };
    sections: Array<{
      section_key: string;
      is_visible: boolean;
      sort_order: number;
      layout_variant: string;
      settings: Record<string, unknown>;
    }>;
  };

  await supabase
    .from("page_profiles")
    .update({ typography: snapshot.profile.typography })
    .eq("id", version.profile_id);

  await Promise.all(
    snapshot.sections.map((s) =>
      supabase.from("page_sections").upsert(
        {
          profile_id: version.profile_id,
          section_key: s.section_key,
          is_visible: s.is_visible,
          sort_order: s.sort_order,
          layout_variant: s.layout_variant,
          settings: s.settings,
        },
        { onConflict: "profile_id,section_key" },
      ),
    ),
  );

  afterContentChange();
}
