"use client";

import { useState } from "react";
import { useCanvasStore } from "../store";
import SortableList from "./SortableList";
import LayoutVariantPicker from "./LayoutVariantPicker";
import { VARIANT_CATALOG } from "@/components/sections/registry";
import type { SectionKey } from "@/lib/types";

const SECTION_LABEL: Record<SectionKey, string> = {
  hero: "Hero",
  vehicles: "Available Vehicles",
  reviews: "Reviews",
  clients: "Released to Happy Clients",
};

export default function SectionList({
  onManageContent,
}: {
  onManageContent: (key: SectionKey) => void;
}) {
  const sections = useCanvasStore((s) => s.sections);
  const toggleVisible = useCanvasStore((s) => s.toggleVisible);
  const setVariant = useCanvasStore((s) => s.setVariant);
  const reorderSections = useCanvasStore((s) => s.reorderSections);
  const [pickerFor, setPickerFor] = useState<SectionKey | null>(null);

  const items = sections.map((s) => ({ id: s.section_key, ...s }));

  return (
    <div>
      <SortableList
        items={items}
        onReorder={(newItems) => {
          for (let i = 1; i < newItems.length; i++) {
            reorderSections(newItems[i - 1].section_key, newItems[i].section_key);
          }
        }}
        renderItem={(section, drag, isDragging) => {
          const variantLabel =
            VARIANT_CATALOG[section.section_key].find((v) => v.key === section.layout_variant)
              ?.label ?? section.layout_variant;
          return (
            <div
              className={`flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm ${
                isDragging ? "border-brand-red" : "border-gray-200"
              }`}
            >
              <button
                type="button"
                {...drag.attributes}
                {...drag.listeners}
                className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing"
                aria-label="Drag to reorder"
              >
                ⠿
              </button>

              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-black">
                  {SECTION_LABEL[section.section_key]}
                </p>
                <p className="text-xs text-gray-400">{variantLabel}</p>
              </div>

              <button
                type="button"
                onClick={() => setPickerFor(section.section_key)}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Layout
              </button>
              <button
                type="button"
                onClick={() => onManageContent(section.section_key)}
                className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Content
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={section.is_visible}
                onClick={() => toggleVisible(section.section_key)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  section.is_visible ? "bg-brand-red" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    section.is_visible ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          );
        }}
      />

      {pickerFor && (
        <LayoutVariantPicker
          sectionKey={pickerFor}
          currentVariant={sections.find((s) => s.section_key === pickerFor)?.layout_variant ?? ""}
          onSelect={(variant) => setVariant(pickerFor, variant)}
          onClose={() => setPickerFor(null)}
        />
      )}
    </div>
  );
}
