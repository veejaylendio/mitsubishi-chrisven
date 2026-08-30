"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useCanvasStore } from "../store";
import { FontSelect, WeightSelect, SectionTypographyEditor } from "./TypographyControls";
import type { LetterSpacing, SectionKey, TextCase } from "@/lib/types";

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
            <SectionTypographyEditor key={key} sectionKey={key} />
          ))}
        </div>
      )}
    </Modal>
  );
}
