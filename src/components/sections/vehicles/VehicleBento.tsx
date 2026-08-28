import VehicleCard from "@/components/VehicleCard";
import type { VehicleGroup } from "@/lib/types";

function isFeatured(group: VehicleGroup) {
  return group.trims.some((trim) => Boolean(trim.badge));
}

/** Asymmetric grid: badged/featured vehicles get a larger tile than the rest. */
export default function VehicleBento({ groups }: { groups: VehicleGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group, i) => {
        const featured = isFeatured(group);
        return (
          <div
            key={group.name}
            className={
              featured
                ? "sm:col-span-2 sm:row-span-2 h-[420px] sm:h-[600px]"
                : "h-[420px]"
            }
          >
            <VehicleCard vehicle={group} eager={i < 4} />
          </div>
        );
      })}
    </div>
  );
}
