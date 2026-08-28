"use client";

import { useState } from "react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import SortableList from "./SortableList";
import ImageUploadField from "./ImageUploadField";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  duplicateVehicle,
  reorderVehicles,
  bulkUpdateVehicles,
  bulkDeleteVehicles,
  addVehicleImage,
  deleteVehicleImage,
  setPrimaryVehicleImage,
  reorderVehicleImages,
} from "../actions";
import { vehicleSchema } from "../schemas";
import type { AdminVehicle } from "@/lib/content/admin-types";

type VehicleFormValue = {
  id?: string;
  name: string;
  trim: string | null;
  price: number | null;
  description: string | null;
  badge: string | null;
  mileage: number | null;
  year: number | null;
  fuel_type: string | null;
  is_available: boolean;
  is_comparable: boolean;
};

const EMPTY_VEHICLE: VehicleFormValue = {
  name: "",
  trim: null,
  price: null,
  description: null,
  badge: null,
  mileage: null,
  year: null,
  fuel_type: null,
  is_available: true,
  is_comparable: false,
};

function numberField(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function ImageManager({ vehicle, onChanged }: { vehicle: AdminVehicle; onChanged: () => void }) {
  const items = vehicle.images;
  const [colorVariant, setColorVariant] = useState("");
  const [hexColor, setHexColor] = useState("#c8102e");
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!pendingUrl) return;
    await addVehicleImage(vehicle.id, {
      image_url: pendingUrl,
      color_variant: colorVariant || null,
      hex_color: hexColor,
    });
    setPendingUrl(null);
    setColorVariant("");
    onChanged();
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <p className="text-xs font-medium text-gray-500">Photo gallery</p>

      {items.length > 0 && (
        <div className="mt-2">
          <SortableList
            items={items}
            onReorder={(newItems) => reorderVehicleImages(newItems.map((i) => i.id)).then(onChanged)}
            renderItem={(img, drag) => (
              <div className="flex items-center gap-2 rounded-md border border-gray-200 p-2">
                <button type="button" {...drag.attributes} {...drag.listeners} className="cursor-grab text-gray-300">
                  ⠿
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="" className="h-10 w-10 rounded object-cover" />
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-gray-300"
                  style={{ backgroundColor: img.hex_color ?? "#ccc" }}
                />
                <span className="flex-1 text-xs text-gray-600">{img.color_variant ?? "Default"}</span>
                <button
                  type="button"
                  onClick={() => setPrimaryVehicleImage(vehicle.id, img.id).then(onChanged)}
                  className={`rounded px-2 py-1 text-[10px] font-medium ${img.is_primary ? "bg-brand-red text-white" : "border border-gray-200 text-gray-500"}`}
                >
                  {img.is_primary ? "Primary" : "Set primary"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteVehicleImage(img.id).then(onChanged)}
                  className="text-xs text-brand-red"
                >
                  ✕
                </button>
              </div>
            )}
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <ImageUploadField label="New photo" value={pendingUrl} onChange={setPendingUrl} folder="vehicles" />
        <input
          value={colorVariant}
          onChange={(e) => setColorVariant(e.target.value)}
          placeholder="Color name"
          className="rounded-md border border-gray-300 px-2 py-1.5 text-xs"
        />
        <input
          type="color"
          value={hexColor}
          onChange={(e) => setHexColor(e.target.value)}
          className="h-8 w-10 rounded border border-gray-300"
        />
        <button
          type="button"
          disabled={!pendingUrl}
          onClick={handleAdd}
          className="rounded-md bg-brand-black px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          Add to gallery
        </button>
      </div>
    </div>
  );
}

function VehicleForm({
  initial,
  vehicle,
  onChanged,
  onClose,
}: {
  initial: VehicleFormValue;
  vehicle: AdminVehicle | null;
  onChanged: () => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState<VehicleFormValue>(initial);
  const [createdVehicle, setCreatedVehicle] = useState<AdminVehicle | null>(vehicle);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const parsed = vehicleSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (createdVehicle) {
        await updateVehicle(parsed.data);
        onChanged();
      } else {
        const id = await createVehicle(parsed.data);
        setValue({ ...value, id });
        setCreatedVehicle({ ...value, id, images: [], is_archived: false, sort_order: 0 });
        onChanged();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={createdVehicle ? "Edit vehicle" : "New vehicle"} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Model / name</span>
          <input
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Trim</span>
          <input
            value={value.trim ?? ""}
            onChange={(e) => setValue({ ...value, trim: e.target.value || null })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Price (₱)</span>
          <input
            type="number"
            value={value.price ?? ""}
            onChange={(e) => setValue({ ...value, price: numberField(e.target.value) })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Badge (e.g. New Arrival)</span>
          <input
            value={value.badge ?? ""}
            onChange={(e) => setValue({ ...value, badge: e.target.value || null })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Year</span>
          <input
            type="number"
            value={value.year ?? ""}
            onChange={(e) => setValue({ ...value, year: numberField(e.target.value) })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Mileage (km)</span>
          <input
            type="number"
            value={value.mileage ?? ""}
            onChange={(e) => setValue({ ...value, mileage: numberField(e.target.value) })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Fuel type</span>
          <input
            value={value.fuel_type ?? ""}
            onChange={(e) => setValue({ ...value, fuel_type: e.target.value || null })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
      </div>
      <label className="mt-3 block">
        <span className="text-xs font-medium text-gray-500">Description</span>
        <textarea
          value={value.description ?? ""}
          onChange={(e) => setValue({ ...value, description: e.target.value || null })}
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>
      <div className="mt-3 flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={value.is_available}
            onChange={(e) => setValue({ ...value, is_available: e.target.checked })}
          />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={value.is_comparable}
            onChange={(e) => setValue({ ...value, is_comparable: e.target.checked })}
          />
          Include in Compare
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-brand-red">{error}</p>}

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Close
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={handleSave}
          className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
        >
          {busy ? "Saving…" : createdVehicle ? "Save changes" : "Create & add photos"}
        </button>
      </div>

      {createdVehicle ? (
        <ImageManager vehicle={createdVehicle} onChanged={onChanged} />
      ) : (
        <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
          Save this vehicle first to add photos.
        </p>
      )}
    </Modal>
  );
}

export default function VehicleManager({
  vehicles,
  onChanged,
  onClose,
}: {
  vehicles: AdminVehicle[];
  onChanged: () => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<{ initial: VehicleFormValue; vehicle: AdminVehicle | null } | null>(
    null,
  );
  const [deleting, setDeleting] = useState<AdminVehicle | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const items = vehicles;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Modal title="Vehicles" onClose={onClose} wide>
      <p className="mb-3 text-xs text-gray-400">
        Vehicle edits are live immediately — they aren&apos;t part of profile drafts.
      </p>

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setEditing({ initial: EMPTY_VEHICLE, vehicle: null })}
          className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-dark"
        >
          + Add vehicle
        </button>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">{selected.size} selected</span>
            <button
              type="button"
              onClick={() =>
                bulkUpdateVehicles([...selected], { is_available: false }).then(() => {
                  setSelected(new Set());
                  onChanged();
                })
              }
              className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-600 hover:bg-gray-50"
            >
              Hide
            </button>
            <button
              type="button"
              onClick={() =>
                bulkUpdateVehicles([...selected], { is_available: true }).then(() => {
                  setSelected(new Set());
                  onChanged();
                })
              }
              className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-600 hover:bg-gray-50"
            >
              Show
            </button>
            <button
              type="button"
              onClick={() =>
                bulkDeleteVehicles([...selected]).then(() => {
                  setSelected(new Set());
                  onChanged();
                })
              }
              className="rounded border border-gray-200 px-2 py-1 font-medium text-brand-red hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {items.length === 0 && <p className="text-sm text-gray-400">No vehicles yet.</p>}

      <SortableList
        items={items}
        onReorder={(newItems) => reorderVehicles(newItems.map((i) => i.id)).then(onChanged)}
        renderItem={(vehicle, drag) => {
          const primary = vehicle.images.find((i) => i.is_primary) ?? vehicle.images[0];
          return (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <input
                type="checkbox"
                checked={selected.has(vehicle.id)}
                onChange={() => toggleSelect(vehicle.id)}
              />
              <button type="button" {...drag.attributes} {...drag.listeners} className="cursor-grab text-gray-300">
                ⠿
              </button>
              {primary && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={primary.image_url} alt="" className="h-10 w-10 rounded object-cover" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-black">
                  {vehicle.name} {vehicle.trim && <span className="text-gray-400">— {vehicle.trim}</span>}
                </p>
                <p className="text-xs text-gray-400">
                  {vehicle.is_archived ? "Archived" : vehicle.is_available ? "Available" : "Hidden"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => duplicateVehicle(vehicle.id).then(onChanged)}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => setEditing({ initial: vehicle, vehicle })}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleting(vehicle)}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-brand-red hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          );
        }}
      />

      {editing && (
        <VehicleForm
          initial={editing.initial}
          vehicle={editing.vehicle}
          onChanged={onChanged}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete vehicle"
          message={`Are you sure you want to delete "${deleting.name}"? This cannot be undone.`}
          onConfirm={() => deleteVehicle(deleting.id).then(onChanged)}
          onClose={() => setDeleting(null)}
        />
      )}
    </Modal>
  );
}
