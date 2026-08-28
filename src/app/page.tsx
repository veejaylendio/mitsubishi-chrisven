import ReactDOM from "react-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import {
  getActiveProfile,
  getSectionsForProfile,
  getHeroSlides,
  getVehicleGroups,
  getReviews,
  getClientPhotos,
} from "@/lib/content/queries";
import {
  HERO_VARIANTS,
  VEHICLES_VARIANTS,
  REVIEWS_VARIANTS,
  CLIENTS_VARIANTS,
  DEFAULT_VARIANT,
} from "@/components/sections/registry";
import type { PageSection, SectionKey, TypographySettings } from "@/lib/types";
import { resolveSectionTypography, typographyToCssVars } from "@/lib/typography";

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

const FALLBACK_SECTIONS: PageSection[] = (
  ["hero", "vehicles", "reviews", "clients"] as SectionKey[]
).map((section_key, i) => ({
  id: section_key,
  profile_id: "",
  section_key,
  is_visible: true,
  sort_order: i,
  layout_variant: DEFAULT_VARIANT[section_key],
  settings: {},
}));

export default async function Home() {
  const profile = await getActiveProfile();

  const [sections, heroSlides, vehicleGroups, reviews, clientPhotos] = await Promise.all([
    profile ? getSectionsForProfile(profile.id) : Promise.resolve([]),
    getHeroSlides(),
    getVehicleGroups(),
    getReviews(),
    getClientPhotos(),
  ]);

  const orderedSections = (sections.length > 0 ? sections : FALLBACK_SECTIONS)
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  const heroSection = orderedSections.find((s) => s.section_key === "hero");
  const firstHeroImage = heroSection ? heroSlides[0]?.image_url : undefined;
  if (firstHeroImage) {
    ReactDOM.preload(firstHeroImage, { as: "image", fetchPriority: "high" });
  }

  const typography = profile?.typography ?? DEFAULT_TYPOGRAPHY;

  return (
    <div className="flex flex-1 flex-col">
      <NavBar />

      {orderedSections.map((section) => {
        const sectionStyle = typographyToCssVars(
          resolveSectionTypography(typography, section.section_key),
        );

        switch (section.section_key) {
          case "hero": {
            const Hero =
              HERO_VARIANTS[section.layout_variant as keyof typeof HERO_VARIANTS] ??
              HERO_VARIANTS[DEFAULT_VARIANT.hero];
            return (
              <div key={section.id} style={sectionStyle}>
                <Hero slides={heroSlides} />
              </div>
            );
          }
          case "vehicles": {
            const Vehicles =
              VEHICLES_VARIANTS[section.layout_variant as keyof typeof VEHICLES_VARIANTS] ??
              VEHICLES_VARIANTS[DEFAULT_VARIANT.vehicles];
            return (
              <section key={section.id} id="inventory" className="py-16" style={sectionStyle}>
                <h2 className="text-center text-2xl font-bold text-brand-black">
                  Available Vehicles
                </h2>
                <div className="mt-10">
                  <Vehicles groups={vehicleGroups} />
                </div>
              </section>
            );
          }
          case "reviews": {
            const Reviews =
              REVIEWS_VARIANTS[section.layout_variant as keyof typeof REVIEWS_VARIANTS] ??
              REVIEWS_VARIANTS[DEFAULT_VARIANT.reviews];
            return (
              <div key={section.id} style={sectionStyle}>
                <Reviews reviews={reviews} />
              </div>
            );
          }
          case "clients": {
            const Clients =
              CLIENTS_VARIANTS[section.layout_variant as keyof typeof CLIENTS_VARIANTS] ??
              CLIENTS_VARIANTS[DEFAULT_VARIANT.clients];
            return (
              <div key={section.id} style={sectionStyle}>
                <Clients photos={clientPhotos} />
              </div>
            );
          }
          default:
            return null;
        }
      })}

      <Footer />
    </div>
  );
}
