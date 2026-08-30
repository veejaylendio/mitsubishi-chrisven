import VehicleCard from "@/components/VehicleCard";
import type { VehicleGroup } from "@/lib/types";

/** Full-width editorial rows, alternating the image side per vehicle. */
export default function VehicleShowcaseRows({ groups }: { groups: VehicleGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl divide-y divide-gray-200 px-6">
      {groups.map((group, i) => (
        <div key={group.name} className="py-8 first:pt-0 last:pb-0">
          <div className="h-[420px] sm:h-[300px]">
            <VehicleCard
              vehicle={group}
              eager={i < 2}
              orientation="horizontal"
              imagePosition={i % 2 === 0 ? "start" : "end"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
