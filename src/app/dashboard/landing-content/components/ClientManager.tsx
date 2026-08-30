"use client";

import { useState } from "react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import SortableList from "./SortableList";
import ImageUploadField from "./ImageUploadField";
import {
  createClientPhoto,
  updateClientPhoto,
  deleteClientPhoto,
  archiveClientPhoto,
  reorderClientPhotos,
  bulkUpdateClientPhotos,
  bulkDeleteClientPhotos,
} from "../actions";
import { clientPhotoSchema } from "../schemas";
import type { AdminClientPhoto } from "@/lib/content/admin-types";

type ClientFormValue = {
  id?: string;
  image_url: string;
  caption: string | null;
  client_name: string | null;
  vehicle_model: string | null;
  delivery_date: string | null;
  quote: string | null;
  branch: string | null;
  consent_confirmed: boolean;
};

const EMPTY_CLIENT: ClientFormValue = {
  image_url: "",
  caption: null,
  client_name: null,
  vehicle_model: null,
  delivery_date: null,
  quote: null,
  branch: null,
  consent_confirmed: false,
};

function ClientForm({
  initial,
  onSaved,
  onClose,
}: {
  initial: ClientFormValue;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState<ClientFormValue>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!value.consent_confirmed) {
      setError("Consent is required before this photo can be saved.");
      return;
    }
    const parsed = clientPhotoSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (value.id) await updateClientPhoto(parsed.data);
      else await createClientPhoto(parsed.data);
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      setBusy(false);
    }
  };

  return (
    <Modal title={value.id ? "Edit client photo" : "New client photo"} onClose={onClose} wide>
      <ImageUploadField
        label="Photo"
        value={value.image_url || null}
        onChange={(url) => setValue({ ...value, image_url: url })}
        folder="clients"
      />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Client name</span>
          <input
            value={value.client_name ?? ""}
            onChange={(e) => setValue({ ...value, client_name: e.target.value || null })}
            placeholder="First name + last initial recommended"
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Vehicle model / trim</span>
          <input
            value={value.vehicle_model ?? ""}
            onChange={(e) => setValue({ ...value, vehicle_model: e.target.value || null })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Delivery date</span>
          <input
            type="date"
            value={value.delivery_date ?? ""}
            onChange={(e) => setValue({ ...value, delivery_date: e.target.value || null })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Branch / location</span>
          <input
            value={value.branch ?? ""}
            onChange={(e) => setValue({ ...value, branch: e.target.value || null })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-gray-500">Quote / caption</span>
        <input
          value={value.quote ?? value.caption ?? ""}
          onChange={(e) => setValue({ ...value, quote: e.target.value || null })}
          placeholder="Loving my new ride!"
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>

      <label className="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <input
          type="checkbox"
          checked={value.consent_confirmed}
          onChange={(e) => setValue({ ...value, consent_confirmed: e.target.checked })}
          className="mt-0.5"
        />
        <span>
          I confirm this client consented to their photo and name being published on the public
          website. Required before this photo can go live.
        </span>
      </label>

      {error && <p className="mt-3 text-sm text-brand-red">{error}</p>}

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy || !value.image_url}
          onClick={handleSave}
          className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

export default function ClientManager({
  photos,
  onChanged,
  onClose,
}: {
  photos: AdminClientPhoto[];
  onChanged: () => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<ClientFormValue | null>(null);
  const [deleting, setDeleting] = useState<AdminClientPhoto | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const items = photos;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Modal title="Released to Happy Clients" onClose={onClose} wide>
      <p className="mb-3 text-xs text-gray-400">
        Client photo edits are live immediately — they aren&apos;t part of profile drafts. Only
        consented photos appear on the public site.
      </p>

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setEditing(EMPTY_CLIENT)}
          className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-dark"
        >
          + Add photo
        </button>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">{selected.size} selected</span>
            <button
              type="button"
              onClick={() =>
                bulkUpdateClientPhotos([...selected], { is_archived: true }).then(() => {
                  setSelected(new Set());
                  onChanged();
                })
              }
              className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-600 hover:bg-gray-50"
            >
              Archive
            </button>
            <button
              type="button"
              onClick={() =>
                bulkDeleteClientPhotos([...selected]).then(() => {
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

      {items.length === 0 && <p className="text-sm text-gray-400">No client photos yet.</p>}

      <SortableList
        items={items}
        onReorder={(newItems) => reorderClientPhotos(newItems.map((i) => i.id)).then(onChanged)}
        renderItem={(photo, drag) => (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
            <input
              type="checkbox"
              checked={selected.has(photo.id)}
              onChange={() => toggleSelect(photo.id)}
            />
            <button type="button" {...drag.attributes} {...drag.listeners} className="cursor-grab text-gray-300">
              ⠿
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.image_url} alt="" className="h-10 w-10 rounded object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-brand-black">
                {photo.client_name ?? "Unnamed"} {photo.vehicle_model && `— ${photo.vehicle_model}`}
              </p>
              <p className="text-xs text-gray-400">
                {photo.is_archived ? "Archived" : photo.consent_confirmed ? "Consented · visible" : "No consent on file"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => archiveClientPhoto(photo.id, !photo.is_archived).then(onChanged)}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              {photo.is_archived ? "Unarchive" : "Archive"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(photo)}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleting(photo)}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-brand-red hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      />

      {editing && <ClientForm initial={editing} onSaved={onChanged} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Delete client photo"
          message={`Are you sure you want to delete this photo of "${deleting.client_name ?? "this client"}"? This cannot be undone.`}
          onConfirm={() => deleteClientPhoto(deleting.id).then(onChanged)}
          onClose={() => setDeleting(null)}
        />
      )}
    </Modal>
  );
}
