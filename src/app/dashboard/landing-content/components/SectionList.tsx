"use client";

import { useState } from "react";
import { useCanvasStore } from "../store";
import SortableList from "./SortableList";
import { SectionTypographyEditor, SECTION_LABEL } from "./TypographyControls";
import PanelToggleButton from "./PanelToggleButton";
import { VARIANT_CATALOG } from "@/components/sections/registry";
import type { SectionKey } from "@/lib/types";

type DetailTab = "layout" | "typography";

function SectionDetail({
  sectionKey,
  initialTab,
  onBack,
  onManageContent,
}: {
  sectionKey: SectionKey;
  initialTab: DetailTab;
  onBack: () => void;
  onManageContent: (key: SectionKey) => void;
}) {
  const [tab, setTab] = useState<DetailTab>(initialTab);
  const sections = useCanvasStore((s) => s.sections);
  const setVariant = useCanvasStore((s) => s.setVariant);
  const currentVariant = sections.find((s) => s.section_key === sectionKey)?.layout_variant ?? "";
  const options = VARIANT_CATALOG[sectionKey];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-gray-200 bg-white px-4 py-3.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to sections"
          className="text-gray-500 hover:text-brand-black"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-bold text-brand-black">{SECTION_LABEL[sectionKey]}</span>
      </div>

      <div className="flex border-b border-gray-200 bg-white text-sm">
        <button
          type="button"
          onClick={() => setTab("layout")}
          className={`flex-1 border-b-2 py-2.5 font-medium ${
            tab === "layout" ? "border-brand-red font-semibold text-brand-red" : "border-transparent text-gray-500"
          }`}
        >
          Layout
        </button>
        <button
          type="button"
          onClick={() => onManageContent(sectionKey)}
          className="flex-1 border-b-2 border-transparent py-2.5 font-medium text-gray-500 hover:text-brand-black"
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setTab("typography")}
          className={`flex-1 border-b-2 py-2.5 font-medium ${
            tab === "typography" ? "border-brand-red font-semibold text-brand-red" : "border-transparent text-gray-500"
          }`}
        >
          Typography
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "layout" ? (
          <>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Choose a layout
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {options.map((option) => {
                const isActive = option.key === currentVariant;
                return (
                  <button
                    key={option.key}
                    type="button"
                    disabled={!option.implemented}
                    onClick={() => setVariant(sectionKey, option.key)}
                    className={`flex h-20 flex-col items-center justify-center gap-1 rounded-lg border p-2 text-center text-xs font-medium transition ${
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
          </>
        ) : (
          <>
            <p className="mb-3 text-xs text-gray-500">
              Give this section its own heading/body font, independent of the site-wide setting.
            </p>
            <SectionTypographyEditor sectionKey={sectionKey} showLabel={false} columns={1} />
          </>
        )}
      </div>
    </div>
  );
}

export default function SectionList({
  onManageContent,
  panelOpen,
  onTogglePanel,
}: {
  onManageContent: (key: SectionKey) => void;
  panelOpen: boolean;
  onTogglePanel: () => void;
}) {
  const sections = useCanvasStore((s) => s.sections);
  const toggleVisible = useCanvasStore((s) => s.toggleVisible);
  const reorderSections = useCanvasStore((s) => s.reorderSections);
  const [detail, setDetail] = useState<{ key: SectionKey; tab: DetailTab } | null>(null);

  if (detail) {
    return (
      <SectionDetail
        sectionKey={detail.key}
        initialTab={detail.tab}
        onBack={() => setDetail(null)}
        onManageContent={onManageContent}
      />
    );
  }

  const items = sections.map((s) => ({ id: s.section_key, ...s }));

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Sections</span>
        <PanelToggleButton panelOpen={panelOpen} onTogglePanel={onTogglePanel} />
      </div>
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
                onClick={() => setDetail({ key: section.section_key, tab: "layout" })}
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
    </div>
  );
}
