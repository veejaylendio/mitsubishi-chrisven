import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FONT_VARIABLE_CLASSES } from "@/lib/fonts";
import { typographyToCssVars } from "@/lib/typography";
import { getActiveProfile } from "@/lib/content/queries";
import type { TypographySettings } from "@/lib/types";
import Chatbot from "@/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export const metadata: Metadata = {
  title: "Chrisven Romagos | Mitsubishi Motors Sales",
  description:
    "Chrisven Jay Romagos, Mitsubishi Motors sales consultant — browse available vehicles, financing options, and get in touch.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getActiveProfile();
  const typography = profile?.typography ?? DEFAULT_TYPOGRAPHY;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${FONT_VARIABLE_CLASSES} h-full antialiased`}
      style={typographyToCssVars(typography)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
