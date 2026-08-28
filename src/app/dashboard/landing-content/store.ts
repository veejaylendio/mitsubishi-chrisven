import { create } from "zustand";
import type { SectionKey, TypographySettings } from "@/lib/types";

export type DraftSection = {
  section_key: SectionKey;
  is_visible: boolean;
  sort_order: number;
  layout_variant: string;
  settings: Record<string, unknown>;
};

type CanvasState = {
  profileId: string | null;
  profileName: string;
  sections: DraftSection[];
  typography: TypographySettings;
  dirty: boolean;
  previewMode: "desktop" | "mobile";
  initialize: (input: {
    profileId: string;
    profileName: string;
    sections: DraftSection[];
    typography: TypographySettings;
  }) => void;
  toggleVisible: (key: SectionKey) => void;
  setVariant: (key: SectionKey, variant: string) => void;
  updateSectionSettings: (key: SectionKey, settings: Record<string, unknown>) => void;
  reorderSections: (activeKey: SectionKey, overKey: SectionKey) => void;
  setTypography: (patch: Partial<TypographySettings>) => void;
  setPreviewMode: (mode: "desktop" | "mobile") => void;
  markSaved: () => void;
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  profileId: null,
  profileName: "",
  sections: [],
  typography: {
    headingFont: "geist",
    bodyFont: "geist",
    headingWeight: "bold",
    bodyWeight: "regular",
    sizeScale: "medium",
    letterSpacing: "normal",
    textCase: "normal",
    sectionOverrides: {},
  },
  dirty: false,
  previewMode: "desktop",

  initialize: ({ profileId, profileName, sections, typography }) =>
    set({ profileId, profileName, sections, typography, dirty: false }),

  toggleVisible: (key) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.section_key === key ? { ...s, is_visible: !s.is_visible } : s,
      ),
      dirty: true,
    })),

  setVariant: (key, variant) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.section_key === key ? { ...s, layout_variant: variant } : s,
      ),
      dirty: true,
    })),

  updateSectionSettings: (key, settings) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.section_key === key ? { ...s, settings: { ...s.settings, ...settings } } : s,
      ),
      dirty: true,
    })),

  reorderSections: (activeKey, overKey) => {
    if (activeKey === overKey) return;
    const sections = [...get().sections];
    const fromIndex = sections.findIndex((s) => s.section_key === activeKey);
    const toIndex = sections.findIndex((s) => s.section_key === overKey);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    set({
      sections: sections.map((s, i) => ({ ...s, sort_order: i })),
      dirty: true,
    });
  },

  setTypography: (patch) =>
    set((state) => ({ typography: { ...state.typography, ...patch }, dirty: true })),

  setPreviewMode: (mode) => set({ previewMode: mode }),

  markSaved: () => set({ dirty: false }),
}));
