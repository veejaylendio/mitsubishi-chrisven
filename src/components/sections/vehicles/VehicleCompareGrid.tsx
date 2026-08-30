"use client";

import { useState } from "react";
import VehicleCard from "@/components/VehicleCard";
import LazyImage from "@/components/LazyImage";
import type { VehicleGroup, VehicleTrim } from "@/lib/types";

function isComparable(group: VehicleGroup) {
  return group.trims.some((trim) => trim.is_comparable);
}

const COMPARE_ROWS: { label: string; get: (trim: VehicleTrim) => string }[] = [
  { label: "Trim", get: (trim) => trim.trim ?? "—" },
  { label: "Price", get: (trim) => (trim.price != null ? `₱${trim.price.toLocaleString()}` : "—") },
  { label: "Year", get: (trim) => (trim.year != null ? String(trim.year) : "—") },
  { label: "Mileage", get: (trim) => (trim.mileage != null ? `${trim.mileage.toLocaleString()} km` : "—") },
  { label: "Fuel", get: (trim) => trim.fuel_type ?? "—" },
];

/** Uniform grid with a Compare checkbox per card, plus a sticky bar leading to a side-by-side view. */
export default function VehicleCompareGrid({ groups }: { groups: VehicleGroup[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  if (groups.length === 0) return null;

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectedGroups = groups.filter((group) => selected.has(group.name));

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group, i) => {
          const comparable = isComparable(group);
          const isSelected = selected.has(group.name);
          return (
            <div
              key={group.name}
              className={`relative h-[420px] rounded-lg ${isSelected ? "ring-2 ring-brand-red" : ""}`}
            >
              {comparable && (
                <label className="absolute right-3 top-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(group.name)}
                    className="h-3.5 w-3.5 accent-brand-red"
                  />
                  Compare
                </label>
              )}
              <VehicleCard vehicle={group} eager={i < 4} />
            </div>
          );
        })}
      </div>

      {selected.size > 0 && (
        <div className="sticky bottom-4 z-20 mx-auto mt-6 flex max-w-md items-center justify-between gap-4 rounded-lg bg-brand-black px-5 py-3 text-white shadow-lg">
          <span className="text-sm">
            {selected.size} selected for comparison
          </span>
          <button
            type="button"
            disabled={selected.size < 2}
            onClick={() => setShowCompare(true)}
            className="rounded-md bg-brand-red px-4 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            Compare
          </button>
        </div>
      )}

      {showCompare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setShowCompare(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-black">Compare Vehicles</h3>
              <button
                type="button"
                onClick={() => setShowCompare(false)}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-28 border-b border-gray-200 pb-3 pr-4" />
                    {selectedGroups.map((group) => {
                      const trim = group.trims[0];
                      const image = trim?.images[0];
                      return (
                        <th key={group.name} className="border-b border-gray-200 px-4 pb-3">
                          {image && (
                            <LazyImage
                              src={image.image_url}
                              alt={group.name}
                              wrapperClassName="h-24 w-full rounded-md"
                              eager
                            />
                          )}
                          <p className="mt-2 font-bold text-brand-black">{group.name}</p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label}>
                      <td className="border-b border-gray-100 py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {row.label}
                      </td>
                      {selectedGroups.map((group) => (
                        <td key={group.name} className="border-b border-gray-100 px-4 py-3 text-gray-700">
                          {row.get(group.trims[0])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
