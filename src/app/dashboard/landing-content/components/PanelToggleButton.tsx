"use client";

export default function PanelToggleButton({
  panelOpen,
  onTogglePanel,
}: {
  panelOpen: boolean;
  onTogglePanel: () => void;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onTogglePanel}
        aria-pressed={!panelOpen}
        className={`flex h-8 w-8 items-center justify-center rounded-md border ${
          panelOpen ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-red-200 bg-red-50 text-brand-red"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <line x1="9.5" y1="4" x2="9.5" y2="20" />
        </svg>
      </button>
      <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-brand-black px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
        {panelOpen ? "Hide panel" : "Show panel"}{" "}
        <span className="ml-1 text-white/50">⌘\</span>
      </div>
    </div>
  );
}
