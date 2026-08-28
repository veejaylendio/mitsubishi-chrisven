import type { CSSProperties } from "react";
import { FONT_CSS_VAR } from "./fonts";
import type { FontWeightPreset, TypographySettings } from "./types";

const WEIGHT_CSS: Record<FontWeightPreset, string> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

/** Resolves a profile's global typography settings to root CSS custom properties. */
export function typographyToCssVars(typography: TypographySettings): CSSProperties {
  return {
    "--font-heading": FONT_CSS_VAR[typography.headingFont],
    "--font-body": FONT_CSS_VAR[typography.bodyFont],
    "--heading-weight": WEIGHT_CSS[typography.headingWeight],
    "--body-weight": WEIGHT_CSS[typography.bodyWeight],
  } as CSSProperties;
}
