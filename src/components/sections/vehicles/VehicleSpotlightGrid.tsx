import VehicleCard from "@/components/VehicleCard";
import type { VehicleGroup } from "@/lib/types";

function findFeatured(groups: VehicleGroup[]) {
  return groups.find((group) => group.trims.some((trim) => Boolean(trim.badge))) ?? groups[0] ?? null;
}

/** One curated vehicle spotlighted at full width, with the rest in a uniform grid below. */
export default function VehicleSpotlightGrid({ groups }: { groups: VehicleGroup[] }) {
  if (groups.length === 0) return null;

  const featured = findFeatured(groups);
  const rest = groups.filter((group) => group !== featured);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6">
      {featured && (
        <div className="h-[420px] sm:h-[320px]">
          <VehicleCard vehicle={featured} eager orientation="horizontal" />
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((group, i) => (
            <div key={group.name} className="h-[420px]">
              <VehicleCard vehicle={group} eager={i < 4} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
