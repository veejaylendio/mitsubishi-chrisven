import ReactDOM from "react-dom";
import { createClient } from "@/lib/supabase/server";
import NavBar from "@/components/NavBar";
import HeroCarousel from "@/components/HeroCarousel";
import VehicleCarousel from "@/components/VehicleCarousel";
import ReviewsSection from "@/components/ReviewsSection";
import ClientsGallery from "@/components/ClientsGallery";
import Footer from "@/components/Footer";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: heroSlides }, { data: vehicles }, { data: vehicleImages }, { data: reviews }, { data: clientPhotos }] =
    await Promise.all([
      supabase
        .from("landing_content")
        .select("id, title, body, image_url")
        .eq("section", "hero_slide")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("vehicles")
        .select("id, name, trim, price, description")
        .eq("is_available", true)
        .order("sort_order"),
      supabase
        .from("vehicle_images")
        .select("vehicle_id, color_variant, image_url, hex_color, sort_order")
        .order("sort_order"),
      supabase
        .from("reviews")
        .select("id, author_name, rating, body")
        .eq("is_published", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("clients_gallery")
        .select("id, image_url, caption")
        .order("sort_order"),
    ]);

  const vehiclesWithImages = (vehicles ?? []).map((vehicle) => ({
    ...vehicle,
    images: (vehicleImages ?? []).filter((img) => img.vehicle_id === vehicle.id),
  }));

  const vehicleGroups = Object.values(
    vehiclesWithImages.reduce<Record<string, { name: string; trims: typeof vehiclesWithImages }>>(
      (groups, vehicle) => {
        groups[vehicle.name] ??= { name: vehicle.name, trims: [] };
        groups[vehicle.name].trims.push(vehicle);
        return groups;
      },
      {},
    ),
  );

  const firstHeroImage = heroSlides?.[0]?.image_url;
  if (firstHeroImage) {
    ReactDOM.preload(firstHeroImage, { as: "image", fetchPriority: "high" });
  }

  return (
    <div className="flex flex-1 flex-col">
      <NavBar />
      <HeroCarousel slides={heroSlides ?? []} />

      <section id="inventory" className="py-16">
        <h2 className="text-center text-2xl font-bold text-brand-black">
          Available Vehicles
        </h2>
        <div className="mt-10">
          <VehicleCarousel groups={vehicleGroups} />
        </div>
      </section>

      <ReviewsSection reviews={reviews ?? []} />
      <ClientsGallery photos={clientPhotos ?? []} />
      <Footer />
    </div>
  );
}
