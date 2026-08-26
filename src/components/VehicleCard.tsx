"use client";

import { useState } from "react";

export type VehicleImage = {
  color_variant: string | null;
  image_url: string;
};

export type Vehicle = {
  id: string;
  name: string;
  trim: string | null;
  price: number | null;
  description: string | null;
  images: VehicleImage[];
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const colors = vehicle.images.map((img) => img.color_variant ?? "Default");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const activeImage =
    vehicle.images.find((img) => (img.color_variant ?? "Default") === selectedColor) ??
    vehicle.images[0];

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {activeImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={activeImage.image_url}
          alt={`${vehicle.name} in ${selectedColor}`}
          className="h-56 w-full object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="text-lg font-bold text-brand-black">{vehicle.name}</h3>
        {vehicle.trim && <p className="text-sm text-gray-500">{vehicle.trim}</p>}
        {vehicle.price && (
          <p className="mt-2 text-xl font-bold text-brand-red">
            ₱{Number(vehicle.price).toLocaleString()}
          </p>
        )}
        {vehicle.description && (
          <p className="mt-2 text-sm text-gray-600">{vehicle.description}</p>
        )}

        {colors.length > 1 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Color:</span>
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  color === selectedColor
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-gray-300 text-gray-600 hover:border-brand-red"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        )}

        <a
          href={`/apply?vehicle=${vehicle.id}`}
          className="mt-4 block rounded-md bg-brand-black py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-red"
        >
          Inquire / Apply
        </a>
      </div>
    </div>
  );
}
