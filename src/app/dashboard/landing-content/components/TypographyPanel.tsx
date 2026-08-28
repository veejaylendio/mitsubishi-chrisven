"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useCanvasStore } from "../store";
import { FONT_LABEL } from "@/lib/fonts";
import {
  FONT_OPTIONS,
  type FontOption,
  type FontWeightPreset,
  type LetterSpacing,
  type SectionKey,
  type SectionTypographyOverride,
  type TextCase,
} from "@/lib/types";

const SECTION_LABEL: Record<SectionKey, string> = {
  hero: "Hero",
  vehicles: "Available Vehicles",
  reviews: "Reviews",
  clients: "Released to Happy Clients",
};

function FontSelect({
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

function WeightSelect({
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

function SectionOverrideEditor({ sectionKey }: { sectionKey: SectionKey }) {
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
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-brand-black">{SECTION_LABEL[sectionKey]}</p>
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
        <div className="mt-3 grid grid-cols-2 gap-3">
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

export default function TypographyPanel({ onClose }: { onClose: () => void }) {
  const typography = useCanvasStore((s) => s.typography);
  const setTypography = useCanvasStore((s) => s.setTypography);
  const [tab, setTab] = useState<"global" | "sections">("global");

  return (
    <Modal title="Typography" onClose={onClose} wide>
      <div className="mb-4 flex gap-1 rounded-md bg-gray-100 p-1 text-sm">
        {(["global", "sections"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded px-3 py-1.5 font-medium capitalize ${
              tab === t ? "bg-white text-brand-black shadow-sm" : "text-gray-500"
            }`}
          >
            {t === "global" ? "Site-wide" : "Section overrides"}
          </button>
        ))}
      </div>

      {tab === "global" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FontSelect
              label="Heading font"
              value={typography.headingFont}
              onChange={(v) => setTypography({ headingFont: v })}
            />
            <FontSelect
              label="Body font"
              value={typography.bodyFont}
              onChange={(v) => setTypography({ bodyFont: v })}
            />
            <WeightSelect
              label="Heading weight"
              value={typography.headingWeight}
              onChange={(v) => setTypography({ headingWeight: v })}
            />
            <WeightSelect
              label="Body weight"
              value={typography.bodyWeight}
              onChange={(v) => setTypography({ bodyWeight: v })}
            />
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Letter spacing</span>
              <select
                value={typography.letterSpacing}
                onChange={(e) =>
                  setTypography({ letterSpacing: e.target.value as LetterSpacing })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="wide">Wide</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Heading text case</span>
              <select
                value={typography.textCase}
                onChange={(e) => setTypography({ textCase: e.target.value as TextCase })}
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="titlecase">Title Case</option>
              </select>
            </label>
          </div>
          <label className="block opacity-50">
            <span className="text-xs font-medium text-gray-500">
              Size scale <span className="italic">(coming soon)</span>
            </span>
            <select disabled className="mt-1 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm">
              <option>Medium</option>
            </select>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Turn on an override to give a section its own heading/body font, independent of the
            site-wide setting above. Other sections keep inheriting the site-wide font.
          </p>
          {(["hero", "vehicles", "reviews", "clients"] as SectionKey[]).map((key) => (
            <SectionOverrideEditor key={key} sectionKey={key} />
          ))}
        </div>
      )}
    </Modal>
  );
}
