"use client";

import { useState } from "react";
import type { z } from "zod";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import SortableList from "./SortableList";
import ImageUploadField from "./ImageUploadField";
import {
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from "../actions";
import { heroSlideSchema } from "../schemas";
import type { AdminHeroSlide } from "@/lib/content/admin-types";
import type { CtaButton } from "@/lib/types";

type FormValue = z.infer<typeof heroSlideSchema>;

const EMPTY_SLIDE: FormValue = {
  title: "",
  subtitle: "",
  body: "",
  image_url: null,
  video_url: null,
  media_type: "image",
  buttons: [],
  text_align: "center",
  overlay_opacity: 0.4,
  is_active: true,
};

function ButtonEditor({
  buttons,
  onChange,
}: {
  buttons: CtaButton[];
  onChange: (buttons: CtaButton[]) => void;
}) {
  const update = (i: number, patch: Partial<CtaButton>) => {
    onChange(buttons.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Buttons (max 2)</span>
        {buttons.length < 2 && (
          <button
            type="button"
            onClick={() =>
              onChange([...buttons, { label: "", url: "", style: "primary", size: "md" }])
            }
            className="text-xs font-medium text-brand-red hover:underline"
          >
            + Add button
          </button>
        )}
      </div>
      <div className="mt-2 space-y-3">
        {buttons.map((button, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded-md border border-gray-200 p-2">
            <input
              value={button.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Label"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
            />
            <input
              value={button.url}
              onChange={(e) => update(i, { url: e.target.value })}
              placeholder="URL"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
            />
            <select
              value={button.style}
              onChange={(e) => update(i, { style: e.target.value as CtaButton["style"] })}
              className="rounded border border-gray-300 px-2 py-1 text-xs"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
            <div className="flex gap-1">
              <select
                value={button.size}
                onChange={(e) => update(i, { size: e.target.value as CtaButton["size"] })}
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
              <button
                type="button"
                onClick={() => onChange(buttons.filter((_, idx) => idx !== i))}
                className="rounded border border-gray-200 px-2 text-xs text-brand-red"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSlideForm({
  initial,
  onSaved,
  onClose,
}: {
  initial: FormValue;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState<FormValue>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const parsed = heroSlideSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (value.id) await updateHeroSlide(parsed.data);
      else await createHeroSlide(parsed.data);
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      setBusy(false);
    }
  };

  return (
    <Modal title={value.id ? "Edit hero slide" : "New hero slide"} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500">Header text</span>
            <input
              value={value.title ?? ""}
              onChange={(e) => setValue({ ...value, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-500">Subheading</span>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => setValue({ ...value, subtitle: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Body text</span>
          <textarea
            value={value.body ?? ""}
            onChange={(e) => setValue({ ...value, body: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500">Background media</span>
            <select
              value={value.media_type}
              onChange={(e) =>
                setValue({ ...value, media_type: e.target.value as "image" | "video" })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-500">Text alignment</span>
            <select
              value={value.text_align}
              onChange={(e) =>
                setValue({ ...value, text_align: e.target.value as FormValue["text_align"] })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>

        <ImageUploadField
          label="Background image"
          value={value.image_url}
          onChange={(url) => setValue({ ...value, image_url: url })}
          folder="hero"
        />
        {value.media_type === "video" && (
          <ImageUploadField
            label="Background video"
            value={value.video_url}
            onChange={(url) => setValue({ ...value, video_url: url })}
            folder="hero"
            accept="video/mp4,video/webm"
          />
        )}

        <label className="block">
          <span className="text-xs font-medium text-gray-500">
            Overlay darkness ({Math.round(value.overlay_opacity * 100)}%)
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={value.overlay_opacity}
            onChange={(e) => setValue({ ...value, overlay_opacity: Number(e.target.value) })}
            className="mt-1 w-full"
          />
        </label>

        <ButtonEditor
          buttons={value.buttons}
          onChange={(buttons) => setValue({ ...value, buttons })}
        />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={value.is_active}
            onChange={(e) => setValue({ ...value, is_active: e.target.checked })}
          />
          Active (shown on the public site)
        </label>

        {error && <p className="text-sm text-brand-red">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleSave}
            className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function HeroEditor({
  slides,
  onChanged,
  onClose,
}: {
  slides: AdminHeroSlide[];
  onChanged: () => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<FormValue | null>(null);
  const [deleting, setDeleting] = useState<AdminHeroSlide | null>(null);

  const items = slides;

  return (
    <Modal title="Hero slides" onClose={onClose} wide>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setEditing(EMPTY_SLIDE)}
          className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-dark"
        >
          + Add slide
        </button>
      </div>

      {items.length === 0 && <p className="text-sm text-gray-400">No hero slides yet.</p>}

      <SortableList
        items={items}
        onReorder={(newItems) => reorderHeroSlides(newItems.map((i) => i.id)).then(onChanged)}
        renderItem={(slide, drag) => (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
            <button
              type="button"
              {...drag.attributes}
              {...drag.listeners}
              className="cursor-grab text-gray-300 hover:text-gray-500"
            >
              ⠿
            </button>
            {slide.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.image_url} alt="" className="h-12 w-16 rounded object-cover" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-brand-black">{slide.title || "Untitled"}</p>
              <p className="text-xs text-gray-400">{slide.is_active ? "Active" : "Inactive"}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(slide)}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleting(slide)}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-brand-red hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      />

      {editing && (
        <HeroSlideForm initial={editing} onSaved={onChanged} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete hero slide"
          message={`Are you sure you want to delete "${deleting.title ?? "this slide"}"? This cannot be undone.`}
          onConfirm={() => deleteHeroSlide(deleting.id).then(onChanged)}
          onClose={() => setDeleting(null)}
        />
      )}
    </Modal>
  );
}
