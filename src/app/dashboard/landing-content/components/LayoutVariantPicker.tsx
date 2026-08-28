"use client";

import Modal from "./Modal";
import { VARIANT_CATALOG } from "@/components/sections/registry";
import type { SectionKey } from "@/lib/types";

export default function LayoutVariantPicker({
  sectionKey,
  currentVariant,
  onSelect,
  onClose,
}: {
  sectionKey: SectionKey;
  currentVariant: string;
  onSelect: (variant: string) => void;
  onClose: () => void;
}) {
  const options = VARIANT_CATALOG[sectionKey];

  return (
    <Modal title="Choose a layout" onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const isActive = option.key === currentVariant;
          return (
            <button
              key={option.key}
              type="button"
              disabled={!option.implemented}
              onClick={() => {
                onSelect(option.key);
                onClose();
              }}
              className={`flex h-24 flex-col items-center justify-center gap-1 rounded-lg border p-3 text-center text-sm font-medium transition ${
                isActive
                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                  : option.implemented
                    ? "border-gray-200 text-gray-700 hover:border-brand-red hover:text-brand-red"
                    : "cursor-not-allowed border-gray-100 text-gray-300"
              }`}
            >
              {option.label}
              {!option.implemented && <span className="text-[10px] font-normal">Coming soon</span>}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
