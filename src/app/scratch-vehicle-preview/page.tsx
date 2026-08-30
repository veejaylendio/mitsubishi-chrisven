import VehicleSpotlightGrid from "@/components/sections/vehicles/VehicleSpotlightGrid";
import VehicleShowcaseRows from "@/components/sections/vehicles/VehicleShowcaseRows";
import VehicleCompareGrid from "@/components/sections/vehicles/VehicleCompareGrid";
import VehicleSidebarFilters from "@/components/sections/vehicles/VehicleSidebarFilters";
import VehicleToolbarFilters from "@/components/sections/vehicles/VehicleToolbarFilters";
import VehicleSegmentedTabs from "@/components/sections/vehicles/VehicleSegmentedTabs";
import type { VehicleGroup } from "@/lib/types";

const IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#d1d5db'/></svg>`,
  );

const groups: VehicleGroup[] = [
  {
    name: "Xpander",
    trims: [
      {
        id: "1",
        trim: "GLX",
        price: 999000,
        description:
          "A spacious and stylish crossover MPV built for the whole family, with a long enough description to test line clamping across two or three lines of text reliably.",
        images: [
          { color_variant: "White", image_url: IMG, hex_color: "#ffffff", is_primary: true },
          { color_variant: "Red", image_url: IMG, hex_color: "#c8102e" },
        ],
        badge: "Best Seller",
        mileage: 0,
        year: 2026,
        fuel_type: "Gasoline",
        is_comparable: true,
      },
      {
        id: "2",
        trim: "GLS",
        price: 1150000,
        description: "Mid-tier trim with extra convenience features.",
        images: [{ color_variant: "Red", image_url: IMG, hex_color: "#c8102e", is_primary: true }],
        badge: null,
        mileage: 0,
        year: 2026,
        fuel_type: "Gasoline",
        is_comparable: true,
      },
    ],
  },
  {
    name: "Mirage G4",
    trims: [
      {
        id: "3",
        trim: "GLX",
        price: 780000,
        description: "A fuel-efficient sedan built for the everyday commute.",
        images: [{ color_variant: "Silver", image_url: IMG, hex_color: "#c0c0c0", is_primary: true }],
        badge: null,
        mileage: 0,
        year: 2026,
        fuel_type: "Gasoline",
        is_comparable: true,
      },
    ],
  },
  {
    name: "Montero Sport",
    trims: [
      {
        id: "4",
        trim: "GT",
        price: 1899000,
        description: "A rugged SUV ready for any terrain, in or out of the city.",
        images: [{ color_variant: "Black", image_url: IMG, hex_color: "#111111", is_primary: true }],
        badge: null,
        mileage: 0,
        year: 2026,
        fuel_type: "Diesel",
        is_comparable: true,
      },
    ],
  },
  {
    name: "L200",
    trims: [
      {
        id: "5",
        trim: "GLS",
        price: 1350000,
        description: "A reliable pickup truck built to work as hard as you do.",
        images: [{ color_variant: "White", image_url: IMG, hex_color: "#ffffff", is_primary: true }],
        badge: null,
        mileage: 0,
        year: 2026,
        fuel_type: "Diesel",
        is_comparable: false,
      },
    ],
  },
  {
    name: "Xforce",
    trims: [
      {
        id: "6",
        trim: "GT",
        price: 1250000,
        description: "A bold compact SUV with sharp, modern styling.",
        images: [{ color_variant: "Blue", image_url: IMG, hex_color: "#1e3a8a", is_primary: true }],
        badge: null,
        mileage: 0,
        year: 2026,
        fuel_type: "Gasoline",
        is_comparable: true,
      },
    ],
  },
];

export default function ScratchVehiclePreview() {
  return (
    <div className="space-y-16 bg-white py-12">
      <section>
        <h2 className="mb-6 text-center text-xl font-bold">Spotlight + Grid</h2>
        <VehicleSpotlightGrid groups={groups} />
      </section>
      <section>
        <h2 className="mb-6 text-center text-xl font-bold">Alternating Showcase Rows</h2>
        <VehicleShowcaseRows groups={groups} />
      </section>
      <section>
        <h2 className="mb-6 text-center text-xl font-bold">Compare Grid</h2>
        <VehicleCompareGrid groups={groups} />
      </section>
      <section>
        <h2 className="mb-6 text-center text-xl font-bold">Sidebar Filters</h2>
        <VehicleSidebarFilters groups={groups} />
      </section>
      <section>
        <h2 className="mb-6 text-center text-xl font-bold">Toolbar + Filter Popover</h2>
        <VehicleToolbarFilters groups={groups} />
      </section>
      <section>
        <h2 className="mb-6 text-center text-xl font-bold">Segmented Trim Tabs</h2>
        <VehicleSegmentedTabs groups={groups} />
      </section>
    </div>
  );
}
