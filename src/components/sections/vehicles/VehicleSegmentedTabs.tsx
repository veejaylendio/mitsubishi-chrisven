"use client";

import { useMemo, useState } from "react";
import VehicleCard from "@/components/VehicleCard";
import type { VehicleGroup } from "@/lib/types";

/** Single-facet quick filter: a segmented tab row by trim. */
export default function VehicleSegmentedTabs({ groups }: { groups: VehicleGroup[] }) {
  const [trimFilter, setTrimFilter] = useState("all");

  const trims = useMemo(
    () => Array.from(new Set(groups.flatMap((g) => g.trims.map((t) => t.trim).filter(Boolean)))),
    [groups],
  );

  const filtered = groups
    .map((group) => ({
      ...group,
      trims: group.trims.filter((trim) => trimFilter === "all" || trim.trim === trimFilter),
    }))
    .filter((group) => group.trims.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-6 inline-flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setTrimFilter("all")}
          className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
            trimFilter === "all" ? "bg-white text-brand-black shadow-sm" : "text-gray-500"
          }`}
        >
          All
        </button>
        {trims.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTrimFilter(t as string)}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              trimFilter === t ? "bg-white text-brand-black shadow-sm" : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-400">No vehicles match that trim.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((group, i) => (
            <div key={group.name} className="h-[420px]">
              <VehicleCard vehicle={group} eager={i < 4} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
