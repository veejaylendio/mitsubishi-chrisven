import type { CSSProperties } from "react";
import { FONT_CSS_VAR } from "./fonts";
import type { FontWeightPreset, SectionKey, TextCase, TypographySettings } from "./types";

const WEIGHT_CSS: Record<FontWeightPreset, string> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

const TEXT_CASE_CSS: Record<TextCase, string> = {
  normal: "none",
  uppercase: "uppercase",
  titlecase: "capitalize",
};

/** Resolves typography settings to CSS custom properties (root or a section wrapper). */
export function typographyToCssVars(typography: TypographySettings): CSSProperties {
  return {
    "--font-heading": FONT_CSS_VAR[typography.headingFont],
    "--font-body": FONT_CSS_VAR[typography.bodyFont],
    "--heading-weight": WEIGHT_CSS[typography.headingWeight],
    "--body-weight": WEIGHT_CSS[typography.bodyWeight],
    "--letter-spacing": typography.letterSpacing === "wide" ? "0.05em" : "normal",
    "--text-case": TEXT_CASE_CSS[typography.textCase],
  } as CSSProperties;
}

/** Merges a section's typography override (if any) onto the global settings. */
export function resolveSectionTypography(
  typography: TypographySettings,
  sectionKey: SectionKey,
): TypographySettings {
  const override = typography.sectionOverrides[sectionKey];
  if (!override) return typography;
  return {
    ...typography,
    ...override,
  };
}
