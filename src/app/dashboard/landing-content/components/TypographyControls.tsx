"use client";

import { useCanvasStore } from "../store";
import { FONT_LABEL } from "@/lib/fonts";
import {
  FONT_OPTIONS,
  type FontOption,
  type FontWeightPreset,
  type SectionKey,
  type SectionTypographyOverride,
} from "@/lib/types";

export const SECTION_LABEL: Record<SectionKey, string> = {
  hero: "Hero",
  vehicles: "Available Vehicles",
  reviews: "Reviews",
  clients: "Released to Happy Clients",
};

export function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: FontOption;
  onChange: (v: FontOption) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FontOption)}
        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
      >
        {FONT_OPTIONS.map((f) => (
          <option key={f} value={f}>
            {FONT_LABEL[f]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function WeightSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: FontWeightPreset;
  onChange: (v: FontWeightPreset) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FontWeightPreset)}
        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
      >
        <option value="regular">Regular</option>
        <option value="medium">Medium</option>
        <option value="semibold">Semibold</option>
        <option value="bold">Bold</option>
      </select>
    </label>
  );
}

/** Toggle + heading/body font override for one section. Reused by the global
 * Typography modal's "Section overrides" tab and the per-section inline panel. */
export function SectionTypographyEditor({
  sectionKey,
  showLabel = true,
  columns = 2,
}: {
  sectionKey: SectionKey;
  showLabel?: boolean;
  columns?: 1 | 2;
}) {
  const typography = useCanvasStore((s) => s.typography);
  const setTypography = useCanvasStore((s) => s.setTypography);
  const override = typography.sectionOverrides[sectionKey];
  const enabled = Boolean(override);

  const patchOverride = (patch: Partial<SectionTypographyOverride>) => {
    setTypography({
      sectionOverrides: {
        ...typography.sectionOverrides,
        [sectionKey]: { ...override, ...patch },
      },
    });
  };

  const toggle = () => {
    const next = { ...typography.sectionOverrides };
    if (enabled) {
      delete next[sectionKey];
    } else {
      next[sectionKey] = { headingFont: typography.headingFont };
    }
    setTypography({ sectionOverrides: next });
  };

  return (
    <div className={showLabel ? "rounded-lg border border-gray-200 p-3" : ""}>
      <div className="flex items-center justify-between">
        {showLabel ? (
          <p className="text-sm font-medium text-brand-black">{SECTION_LABEL[sectionKey]}</p>
        ) : (
          <p className="text-xs font-medium text-gray-500">Override this section&apos;s fonts</p>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={toggle}
          className={`relative h-5 w-9 shrink-0 rounded-full transition ${
            enabled ? "bg-brand-red" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
              enabled ? "left-4" : "left-0.5"
            }`}
          />
        </button>
      </div>
      {enabled && override && (
        <div className={`mt-3 grid gap-3 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
          <FontSelect
            label="Heading font"
            value={override.headingFont ?? typography.headingFont}
            onChange={(v) => patchOverride({ headingFont: v })}
          />
          <FontSelect
            label="Body font"
            value={override.bodyFont ?? typography.bodyFont}
            onChange={(v) => patchOverride({ bodyFont: v })}
          />
        </div>
      )}
    </div>
  );
}
