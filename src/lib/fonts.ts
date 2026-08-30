import {
  Inter,
  Poppins,
  Montserrat,
  Roboto,
  Manrope,
  Space_Grotesk,
  Archivo,
  Sora,
  Barlow_Condensed,
  Oswald,
  Playfair_Display,
  Libre_Franklin,
} from "next/font/google";
import type { FontOption } from "./types";

// next/font/google statically analyzes each call's arguments at build time, so
// weight arrays must be inline literals here (not spread from a shared const).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"] });
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const libreFranklin = Libre_Franklin({ variable: "--font-libre-franklin", subsets: ["latin"] });

/** Applied once on the root <html> so every curated font is available as a CSS var. */
export const FONT_VARIABLE_CLASSES = [
  inter.variable,
  poppins.variable,
  montserrat.variable,
  roboto.variable,
  manrope.variable,
  spaceGrotesk.variable,
  archivo.variable,
  sora.variable,
  barlowCondensed.variable,
  oswald.variable,
  playfairDisplay.variable,
  libreFranklin.variable,
].join(" ");

/** Maps a curated FontOption (admin-selectable) to the CSS var that resolves it. */
export const FONT_CSS_VAR: Record<FontOption, string> = {
  geist: "var(--font-geist-sans)",
  inter: "var(--font-inter)",
  poppins: "var(--font-poppins)",
  montserrat: "var(--font-montserrat)",
  roboto: "var(--font-roboto)",
  manrope: "var(--font-manrope)",
  space_grotesk: "var(--font-space-grotesk)",
  archivo: "var(--font-archivo)",
  sora: "var(--font-sora)",
  barlow_condensed: "var(--font-barlow-condensed)",
  oswald: "var(--font-oswald)",
  playfair_display: "var(--font-playfair-display)",
  libre_franklin: "var(--font-libre-franklin)",
};

export const FONT_LABEL: Record<FontOption, string> = {
  geist: "Geist (Default)",
  inter: "Inter",
  poppins: "Poppins",
  montserrat: "Montserrat",
  roboto: "Roboto",
  manrope: "Manrope",
  space_grotesk: "Space Grotesk",
  archivo: "Archivo",
  sora: "Sora",
  barlow_condensed: "Barlow Condensed",
  oswald: "Oswald",
  playfair_display: "Playfair Display",
  libre_franklin: "Libre Franklin",
};
