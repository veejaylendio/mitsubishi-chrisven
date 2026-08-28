"use client";

import { useState } from "react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import SortableList from "./SortableList";
import ImageUploadField from "./ImageUploadField";
import {
  createReview,
  updateReview,
  deleteReview,
  reorderReviews,
  bulkUpdateReviews,
  bulkDeleteReviews,
} from "../actions";
import { reviewSchema } from "../schemas";
import type { AdminReview } from "@/lib/content/admin-types";

type ReviewFormValue = {
  id?: string;
  author_name: string;
  rating: number | null;
  body: string | null;
  reviewer_photo_url: string | null;
  source_platform: string | null;
  is_featured: boolean;
  is_anonymous: boolean;
  is_published: boolean;
};

const EMPTY_REVIEW: ReviewFormValue = {
  author_name: "",
  rating: 5,
  body: "",
  reviewer_photo_url: null,
  source_platform: null,
  is_featured: false,
  is_anonymous: false,
  is_published: true,
};

function ReviewForm({
  initial,
  onSaved,
  onClose,
}: {
  initial: ReviewFormValue;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState<ReviewFormValue>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const parsed = reviewSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (value.id) await updateReview(parsed.data);
      else await createReview(parsed.data);
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      setBusy(false);
    }
  };

  return (
    <Modal title={value.id ? "Edit review" : "New review"} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Reviewer name</span>
          <input
            value={value.author_name}
            onChange={(e) => setValue({ ...value, author_name: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Rating</span>
          <select
            value={value.rating ?? ""}
            onChange={(e) => setValue({ ...value, rating: e.target.value ? Number(e.target.value) : null })}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">No rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500">Source platform</span>
          <input
            value={value.source_platform ?? ""}
            onChange={(e) => setValue({ ...value, source_platform: e.target.value || null })}
            placeholder="Google, Facebook, Yelp…"
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <ImageUploadField
          label="Reviewer photo (optional)"
          value={value.reviewer_photo_url}
          onChange={(url) => setValue({ ...value, reviewer_photo_url: url })}
          folder="reviews"
        />
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-gray-500">Review text</span>
        <textarea
          value={value.body ?? ""}
          onChange={(e) => setValue({ ...value, body: e.target.value || null })}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={value.is_anonymous}
            onChange={(e) => setValue({ ...value, is_anonymous: e.target.checked })}
          />
          Show as &quot;Anonymous&quot;
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={value.is_featured}
            onChange={(e) => setValue({ ...value, is_featured: e.target.checked })}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={value.is_published}
            onChange={(e) => setValue({ ...value, is_published: e.target.checked })}
          />
          Published (visible on site)
        </label>
      </div>

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
          disabled={busy}
          onClick={handleSave}
          className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

export default function ReviewManager({
  reviews,
  onChanged,
  onClose,
}: {
  reviews: AdminReview[];
  onChanged: () => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<ReviewFormValue | null>(null);
  const [deleting, setDeleting] = useState<AdminReview | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const items = reviews;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Modal title="Reviews" onClose={onClose} wide>
      <p className="mb-3 text-xs text-gray-400">
        Review edits are live immediately — they aren&apos;t part of profile drafts.
      </p>

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setEditing(EMPTY_REVIEW)}
          className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-dark"
        >
          + Add review
        </button>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">{selected.size} selected</span>
            <button
              type="button"
              onClick={() =>
                bulkUpdateReviews([...selected], { is_published: false }).then(() => {
                  setSelected(new Set());
                  onChanged();
                })
              }
              className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-600 hover:bg-gray-50"
            >
              Unpublish
            </button>
            <button
              type="button"
              onClick={() =>
                bulkUpdateReviews([...selected], { is_published: true }).then(() => {
                  setSelected(new Set());
                  onChanged();
                })
              }
              className="rounded border border-gray-200 px-2 py-1 font-medium text-gray-600 hover:bg-gray-50"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() =>
                bulkDeleteReviews([...selected]).then(() => {
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

      {items.length === 0 && <p className="text-sm text-gray-400">No reviews yet.</p>}

      <SortableList
        items={items}
        onReorder={(newItems) => reorderReviews(newItems.map((i) => i.id)).then(onChanged)}
        renderItem={(review, drag) => (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
            <input
              type="checkbox"
              checked={selected.has(review.id)}
              onChange={() => toggleSelect(review.id)}
            />
            <button type="button" {...drag.attributes} {...drag.listeners} className="cursor-grab text-gray-300">
              ⠿
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-brand-black">
                {review.is_anonymous ? "Anonymous" : review.author_name}
                {review.is_featured && (
                  <span className="ml-2 rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-semibold text-brand-red">
                    Featured
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {review.rating ? "★".repeat(review.rating) : "No rating"} ·{" "}
                {review.is_published ? "Published" : "Unpublished"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(review)}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleting(review)}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-brand-red hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      />

      {editing && <ReviewForm initial={editing} onSaved={onChanged} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Delete review"
          message={`Are you sure you want to delete this review from "${deleting.author_name}"? This cannot be undone.`}
          onConfirm={() => deleteReview(deleting.id).then(onChanged)}
          onClose={() => setDeleting(null)}
        />
      )}
    </Modal>
  );
}
