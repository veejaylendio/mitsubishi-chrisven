export type ButtonStyle = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type CtaButton = {
  label: string;
  url: string;
  style: ButtonStyle;
  size: ButtonSize;
};

export type TextAlign = "left" | "center" | "right";
export type HeroMediaType = "image" | "video";

export type HeroSlide = {
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
};

export type VehicleImage = {
  color_variant: string | null;
  image_url: string;
  hex_color: string | null;
  is_primary?: boolean;
};

export type VehicleTrim = {
  id: string;
  trim: string | null;
  price: number | null;
  description: string | null;
  images: VehicleImage[];
  badge: string | null;
  mileage: number | null;
  year: number | null;
  fuel_type: string | null;
  is_comparable: boolean;
};

export type VehicleGroup = {
  name: string;
  trims: VehicleTrim[];
};

export type VehicleOption = {
  id: string;
  name: string;
  trim: string | null;
  year: number | null;
};

export type FinancingType = "cash" | "loan";

export type Review = {
  id: string;
  author_name: string;
  rating: number | null;
  body: string | null;
  reviewer_photo_url: string | null;
  video_url: string | null;
  source_platform: string | null;
  is_featured: boolean;
  is_anonymous: boolean;
};

export type ClientPhoto = {
  id: string;
  image_url: string;
  caption: string | null;
  client_name: string | null;
  vehicle_model: string | null;
  delivery_date: string | null;
  quote: string | null;
  branch: string | null;
  consent_confirmed: boolean;
};

export type ChatSessionStatus = "open" | "closed";

export type ChatSession = {
  id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  visitor_email: string | null;
  visitor_address: string | null;
  status: ChatSessionStatus;
  created_at: string;
};

export type ChatSender = "visitor" | "admin" | "bot";

export type ChatMessage = {
  id: string;
  session_id: string;
  sender: ChatSender;
  body: string;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

export type BankRate = {
  id: string;
  bank_name: string;
  interest_rate: number;
  min_term_months: number | null;
  max_term_months: number | null;
  notes: string | null;
  is_active: boolean;
};

export type VehiclePriceOption = {
  id: string;
  name: string;
  trim: string | null;
  year: number | null;
  price: number | null;
};

export type FontWeightPreset = "regular" | "medium" | "semibold" | "bold";
export type SizeScale = "small" | "medium" | "large" | "xlarge";
export type LetterSpacing = "normal" | "wide";
export type TextCase = "normal" | "uppercase" | "titlecase";

/** Curated font list admins can pick from for heading/body — see AGENTS spec §6.1. */
export const FONT_OPTIONS = [
  "geist",
  "inter",
  "poppins",
  "montserrat",
  "roboto",
  "manrope",
  "space_grotesk",
  "archivo",
  "sora",
  "barlow_condensed",
  "oswald",
  "playfair_display",
  "libre_franklin",
] as const;
export type FontOption = (typeof FONT_OPTIONS)[number];

export type SectionKey = "hero" | "vehicles" | "reviews" | "clients";

export type SectionTypographyOverride = Partial<{
  headingFont: FontOption;
  bodyFont: FontOption;
  headingWeight: FontWeightPreset;
  sizeScale: SizeScale;
  letterSpacing: LetterSpacing;
  textCase: TextCase;
}>;

export type TypographySettings = {
  headingFont: FontOption;
  bodyFont: FontOption;
  headingWeight: FontWeightPreset;
  bodyWeight: FontWeightPreset;
  sizeScale: SizeScale;
  letterSpacing: LetterSpacing;
  textCase: TextCase;
  sectionOverrides: Partial<Record<SectionKey, SectionTypographyOverride>>;
};

export type PageProfileStatus = "draft" | "active" | "scheduled";

export type PageProfile = {
  id: string;
  name: string;
  slug: string;
  status: PageProfileStatus;
  scheduled_publish_at: string | null;
  typography: TypographySettings;
  created_at: string;
  updated_at: string;
};

export type PageSection = {
  id: string;
  profile_id: string;
  section_key: SectionKey;
  is_visible: boolean;
  sort_order: number;
  layout_variant: string;
  settings: Record<string, unknown>;
};
