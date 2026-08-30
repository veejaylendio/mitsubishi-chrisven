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

function FilterFieldset({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</legend>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-brand-red"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Uniform card grid with always-visible sidebar filters (trim, price range, color). */
export default function VehicleSidebarFilters({ groups }: { groups: VehicleGroup[] }) {
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
          groups.flatMap((g) => g.trims.flatMap((t) => t.images.map((i) => i.color_variant).filter(Boolean))),
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
        if (colorFilter !== "all" && !trim.images.some((img) => img.color_variant === colorFilter)) return false;
        return true;
      }),
    }))
    .filter((group) => group.trims.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[180px_1fr]">
        <aside className="flex flex-col gap-6">
          <FilterFieldset
            label="Trim"
            name="trim"
            value={trimFilter}
            onChange={setTrimFilter}
            options={[
              { label: "All trims", value: "all" },
              ...trims.map((t) => ({ label: t as string, value: t as string })),
            ]}
          />
          <FilterFieldset
            label="Price"
            name="price"
            value={String(priceIndex)}
            onChange={(v) => setPriceIndex(Number(v))}
            options={PRICE_BUCKETS.map((b, i) => ({ label: b.label, value: String(i) }))}
          />
          {colors.length > 0 && (
            <FilterFieldset
              label="Color"
              name="color"
              value={colorFilter}
              onChange={setColorFilter}
              options={[
                { label: "All colors", value: "all" },
                ...colors.map((c) => ({ label: c as string, value: c as string })),
              ]}
            />
          )}
        </aside>

        {filtered.length === 0 ? (
          <p className="self-start text-sm text-gray-400">No vehicles match those filters.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((group, i) => (
              <div key={group.name} className="h-[420px]">
                <VehicleCard vehicle={group} eager={i < 4} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
