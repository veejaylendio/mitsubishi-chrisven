"use client";

import { useMemo, useState } from "react";
import VehicleCard from "@/components/VehicleCard";
import type { VehicleGroup } from "@/lib/types";

const PRICE_BUCKETS = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₱1M", min: 0, max: 1_000_000 },
  { label: "₱1M – ₱1.5M", min: 1_000_000, max: 1_500_000 },
  { label: "Over ₱1.5M", min: 1_500_000, max: Infinity },
];

/** Uniform card grid with an inline filter bar (trim, price range, color). */
export default function VehicleCardGridFilters({ groups }: { groups: VehicleGroup[] }) {
  const [trimFilter, setTrimFilter] = useState("all");
  const [priceIndex, setPriceIndex] = useState(0);
  const [colorFilter, setColorFilter] = useState("all");

  const trims = useMemo(
    () => Array.from(new Set(groups.flatMap((g) => g.trims.map((t) => t.trim).filter(Boolean)))),
    [groups],
  );
  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          groups.flatMap((g) =>
            g.trims.flatMap((t) => t.images.map((i) => i.color_variant).filter(Boolean)),
          ),
        ),
      ),
    [groups],
  );

  const bucket = PRICE_BUCKETS[priceIndex];
  const filtered = groups
    .map((group) => ({
      ...group,
      trims: group.trims.filter((trim) => {
        if (trimFilter !== "all" && trim.trim !== trimFilter) return false;
        if (trim.price != null && (trim.price < bucket.min || trim.price > bucket.max)) return false;
        if (
          colorFilter !== "all" &&
          !trim.images.some((img) => img.color_variant === colorFilter)
        )
          return false;
        return true;
      }),
    }))
    .filter((group) => group.trims.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        <select
          value={trimFilter}
          onChange={(e) => setTrimFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All trims</option>
          {trims.map((t) => (
            <option key={t} value={t as string}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={priceIndex}
          onChange={(e) => setPriceIndex(Number(e.target.value))}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {PRICE_BUCKETS.map((b, i) => (
            <option key={b.label} value={i}>
              {b.label}
            </option>
          ))}
        </select>
        <select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All colors</option>
          {colors.map((c) => (
            <option key={c} value={c as string}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-400">No vehicles match those filters.</p>
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
