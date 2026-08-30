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

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-brand-red bg-brand-red text-white"
          : "border-gray-300 bg-white text-gray-600 hover:border-brand-red hover:text-brand-red"
      }`}
    >
      {label}
    </button>
  );
}

type SortOrder = "default" | "price_asc" | "price_desc";

/** Compact toolbar (Filters popover, sort, result count) instead of an always-open filter bar. */
export default function VehicleToolbarFilters({ groups }: { groups: VehicleGroup[] }) {
  const [trimFilter, setTrimFilter] = useState("all");
  const [priceIndex, setPriceIndex] = useState(0);
  const [colorFilter, setColorFilter] = useState("all");
  const [sort, setSort] = useState<SortOrder>("default");
  const [open, setOpen] = useState(false);

  const trims = useMemo(
    () => Array.from(new Set(groups.flatMap((g) => g.trims.map((t) => t.trim).filter(Boolean)))),
    [groups],
  );
  const colors = useMemo(
    () =>
      Array.from(
        new Set(
          groups.flatMap((g) => g.trims.flatMap((t) => t.images.map((i) => i.color_variant).filter(Boolean))),
        ),
      ),
    [groups],
  );

  const bucket = PRICE_BUCKETS[priceIndex];
  let filtered = groups
    .map((group) => ({
      ...group,
      trims: group.trims.filter((trim) => {
        if (trimFilter !== "all" && trim.trim !== trimFilter) return false;
        if (trim.price != null && (trim.price < bucket.min || trim.price > bucket.max)) return false;
        if (colorFilter !== "all" && !trim.images.some((img) => img.color_variant === colorFilter)) return false;
        return true;
      }),
    }))
    .filter((group) => group.trims.length > 0);

  if (sort !== "default") {
    const cheapest = (group: VehicleGroup) => Math.min(...group.trims.map((t) => t.price ?? Infinity));
    filtered = [...filtered].sort((a, b) =>
      sort === "price_asc" ? cheapest(a) - cheapest(b) : cheapest(b) - cheapest(a),
    );
  }

  const activeCount = (trimFilter !== "all" ? 1 : 0) + (priceIndex !== 0 ? 1 : 0) + (colorFilter !== "all" ? 1 : 0);
  const clearFilters = () => {
    setTrimFilter("all");
    setPriceIndex(0);
    setColorFilter("all");
  };

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="relative mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-brand-red"
        >
          Filters
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600"
        >
          <option value="default">Sort: Featured</option>
          <option value="price_asc">Sort: Price (Low to High)</option>
          <option value="price_desc">Sort: Price (High to Low)</option>
        </select>

        <span className="ml-auto text-sm text-gray-400">
          {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}
        </span>

        {open && (
          <div className="absolute left-0 top-full z-10 mt-2 flex flex-wrap gap-6 rounded-lg border border-gray-200 bg-white p-5 shadow-lg">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Trim</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All" active={trimFilter === "all"} onClick={() => setTrimFilter("all")} />
                {trims.map((t) => (
                  <FilterChip
                    key={t}
                    label={t as string}
                    active={trimFilter === t}
                    onClick={() => setTrimFilter(t as string)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Price</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_BUCKETS.map((b, i) => (
                  <FilterChip key={b.label} label={b.label} active={priceIndex === i} onClick={() => setPriceIndex(i)} />
                ))}
              </div>
            </div>
            {colors.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Color</p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="All" active={colorFilter === "all"} onClick={() => setColorFilter("all")} />
                  {colors.map((c) => (
                    <FilterChip
                      key={c}
                      label={c as string}
                      active={colorFilter === c}
                      onClick={() => setColorFilter(c as string)}
                    />
                  ))}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="self-end text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-brand-red"
            >
              Clear filters
            </button>
          </div>
        )}
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
