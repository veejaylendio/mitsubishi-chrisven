import { z } from "zod";

export const ctaButtonSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.string().min(1).max(500),
  style: z.enum(["primary", "secondary", "outline", "ghost"]),
  size: z.enum(["sm", "md", "lg"]),
});

export const heroSlideSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(200).nullable(),
  subtitle: z.string().max(300).nullable(),
  body: z.string().max(500).nullable(),
  image_url: z.string().max(1000).nullable(),
  video_url: z.string().max(1000).nullable(),
  media_type: z.enum(["image", "video"]),
  buttons: z.array(ctaButtonSchema).max(2),
  text_align: z.enum(["left", "center", "right"]),
  overlay_opacity: z.number().min(0).max(1),
  is_active: z.boolean(),
});

export const vehicleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(120),
  trim: z.string().max(60).nullable(),
  price: z.number().nonnegative().nullable(),
  discount: z.number().nonnegative().nullable(),
  description: z.string().max(1000).nullable(),
  badge: z.string().max(40).nullable(),
  mileage: z.number().nonnegative().nullable(),
  year: z.number().min(1980).max(2100).nullable(),
  fuel_type: z.string().max(40).nullable(),
  is_available: z.boolean(),
  is_comparable: z.boolean(),
});

export const reviewSchema = z.object({
  id: z.string().optional(),
  author_name: z.string().min(1).max(120),
  rating: z.number().min(1).max(5).nullable(),
  body: z.string().max(1000).nullable(),
  reviewer_photo_url: z.string().max(1000).nullable(),
  video_url: z.string().max(1000).nullable(),
  source_platform: z.string().max(60).nullable(),
  is_featured: z.boolean(),
  is_anonymous: z.boolean(),
  is_published: z.boolean(),
});

export const clientPhotoSchema = z.object({
  id: z.string().optional(),
  image_url: z.string().min(1).max(1000),
  caption: z.string().max(200).nullable(),
  client_name: z.string().max(120).nullable(),
  vehicle_model: z.string().max(120).nullable(),
  delivery_date: z.string().max(20).nullable(),
  quote: z.string().max(300).nullable(),
  branch: z.string().max(120).nullable(),
  consent_confirmed: z.boolean(),
});

export const sectionDraftSchema = z.object({
  section_key: z.enum(["hero", "vehicles", "reviews", "clients"]),
  is_visible: z.boolean(),
  sort_order: z.number(),
  layout_variant: z.string().min(1).max(60),
  settings: z.record(z.string(), z.unknown()),
});

export const uploadRequestSchema = z.object({
  fileName: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
  fileSize: z.number().positive(),
  folder: z.enum(["hero", "vehicles", "reviews", "clients"]),
});
