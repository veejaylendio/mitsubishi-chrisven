"use client";

import { useState } from "react";
import LazyImage from "./LazyImage";
import type { VehicleGroup } from "@/lib/types";

const TRIM_ORDER = ["GLX", "GLS", "GT"];

function sortTrims(trims: VehicleGroup["trims"]) {
  return [...trims].sort((a, b) => {
    const aIndex = TRIM_ORDER.indexOf(a.trim ?? "");
    const bIndex = TRIM_ORDER.indexOf(b.trim ?? "");
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export default function VehicleCard({
  vehicle,
  eager = false,
}: {
  vehicle: VehicleGroup;
  /** Set true for cards visible without scrolling (e.g. the carousel's initial slide). */
  eager?: boolean;
}) {
  const trims = sortTrims(vehicle.trims);
  const [trimIndex, setTrimIndex] = useState(0);
  const activeTrim = trims[trimIndex];

  const colors = activeTrim.images.map((img) => img.color_variant ?? "Default");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleTrimChange = (index: number) => {
    setTrimIndex(index);
    setSelectedColor(trims[index].images[0]?.color_variant ?? "Default");
  };

  const activeImage =
    activeTrim.images.find((img) => (img.color_variant ?? "Default") === selectedColor) ??
    activeTrim.images[0];

  const specs = [
    activeTrim.year,
    activeTrim.mileage != null ? `${activeTrim.mileage.toLocaleString()} km` : null,
    activeTrim.fuel_type,
  ].filter(Boolean);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="relative">
        {activeImage && (
          <LazyImage
            src={activeImage.image_url}
            alt={`${vehicle.name} ${activeTrim.trim ?? ""} in ${selectedColor}`}
            wrapperClassName="h-56 w-full"
            eager={eager}
          />
        )}
        {activeTrim.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-red px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {activeTrim.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-brand-black">{vehicle.name}</h3>

        <div className="mt-1 min-h-[28px]">
          {trims.length > 1 ? (
            <select
              value={trimIndex}
              onChange={(e) => handleTrimChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-600"
            >
              {trims.map((t, i) => (
                <option key={t.id} value={i}>
                  {t.trim ?? "Standard"}
                </option>
              ))}
            </select>
          ) : (
            activeTrim.trim && <p className="text-sm text-gray-500">{activeTrim.trim}</p>
          )}
        </div>

        {activeTrim.price && (
          <p className="mt-2 text-xl font-bold text-brand-red">
            ₱{Number(activeTrim.price).toLocaleString()}
          </p>
        )}
        {specs.length > 0 && (
          <p className="mt-1 text-xs font-medium text-gray-500">{specs.join(" · ")}</p>
        )}
        {activeTrim.description && (
          <p className="mt-2 text-sm text-gray-600">{activeTrim.description}</p>
        )}

        {colors.length > 1 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Color:</span>
            <div className="flex items-center gap-2">
              {activeTrim.images.map((img) => {
                const color = img.color_variant ?? "Default";
                const isSelected = color === selectedColor;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    title={color}
                    className={`h-6 w-6 shrink-0 rounded-full border border-gray-300 transition ${
                      isSelected ? "ring-2 ring-brand-red ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: img.hex_color ?? "#d1d5db" }}
                  />
                );
              })}
            </div>
          </div>
        )}

        <a
          href={`/apply?vehicle=${activeTrim.id}`}
          className="mt-auto block rounded-md bg-brand-black py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-red"
        >
          Inquire / Apply
        </a>
      </div>
    </div>
  );
}
