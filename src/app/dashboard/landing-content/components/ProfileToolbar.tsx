"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCanvasStore } from "../store";
import {
  createProfile,
  duplicateProfile,
  deleteProfile,
  renameProfile,
  publishProfile,
  saveDraftSections,
} from "../actions";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import VersionHistoryPanel from "./VersionHistoryPanel";
import SchedulePublishDialog from "./SchedulePublishDialog";
import type { PageProfile, PageProfileStatus } from "@/lib/types";

const STATUS_LABEL: Record<PageProfileStatus, string> = {
  draft: "Draft",
  active: "Live",
  scheduled: "Scheduled",
};

const STATUS_CLASS: Record<PageProfileStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-green-100 text-green-700",
  scheduled: "bg-amber-100 text-amber-700",
};

function NamePromptModal({
  title,
  initialValue = "",
  onSubmit,
  onClose,
}: {
  title: string;
  initialValue?: string;
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal title={title} onClose={onClose}>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="Profile name"
      />
      {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}
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
          disabled={busy || !name.trim()}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await onSubmit(name.trim());
              onClose();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Something went wrong");
              setBusy(false);
            }
          }}
          className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
        >
          {busy ? "Working…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

export default function ProfileToolbar({
  profiles,
  currentProfile,
  dueProfiles,
  panelOpen,
  onTogglePanel,
  onOpenPreview,
}: {
  profiles: PageProfile[];
  currentProfile: PageProfile;
  dueProfiles: PageProfile[];
  panelOpen: boolean;
  onTogglePanel: () => void;
  onOpenPreview: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const sections = useCanvasStore((s) => s.sections);
  const typography = useCanvasStore((s) => s.typography);
  const dirty = useCanvasStore((s) => s.dirty);
  const markSaved = useCanvasStore((s) => s.markSaved);

  const [modal, setModal] = useState<
    null | "new" | "duplicate" | "rename" | "delete" | "versions" | "schedule"
  >(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const guardUnsaved = () => {
    if (dirty && !window.confirm("You have unsaved changes. Discard them?")) return false;
    return true;
  };

  const goToProfile = (id: string) => {
    router.push(`/dashboard/landing-content?profile=${id}`);
  };

  const handleSave = async () => {
    if (!currentProfile.id) return;
    setError(null);
    try {
      await saveDraftSections({ profileId: currentProfile.id, sections, typography });
      markSaved();
      showToast("Draft saved");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    }
  };

  const handlePublish = async () => {
    if (!currentProfile.id) return;
    setError(null);
    try {
      if (dirty) {
        await saveDraftSections({ profileId: currentProfile.id, sections, typography });
        markSaved();
      }
      await publishProfile(currentProfile.id);
      showToast(`"${currentProfile.name}" is now live`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to publish");
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      {dueProfiles.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <span>
            {dueProfiles.length === 1
              ? `"${dueProfiles[0].name}" was scheduled to publish and is now due.`
              : `${dueProfiles.length} profiles were scheduled to publish and are now due.`}
          </span>
          {dueProfiles.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() =>
                startTransition(async () => {
                  await publishProfile(p.id);
                  router.refresh();
                })
              }
              className="rounded bg-amber-600 px-2 py-1 font-semibold text-white hover:bg-amber-700"
            >
              Publish &quot;{p.name}&quot; now
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={currentProfile.id}
            onChange={(e) => {
              if (!guardUnsaved()) return;
              goToProfile(e.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_CLASS[currentProfile.status]}`}
          >
            {STATUS_LABEL[currentProfile.status]}
          </span>
          {currentProfile.status === "scheduled" && currentProfile.scheduled_publish_at && (
            <span className="text-xs text-gray-500">
              at {new Date(currentProfile.scheduled_publish_at).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setModal("new")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            New profile
          </button>
          <button
            type="button"
            onClick={() => setModal("duplicate")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => setModal("rename")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={() => setModal("versions")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Version history
          </button>
          {currentProfile.status !== "active" && (
            <>
              <button
                type="button"
                onClick={() => setModal("schedule")}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Schedule
              </button>
              <button
                type="button"
                onClick={() => setModal("delete")}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-brand-red hover:bg-red-50"
              >
                Delete
              </button>
            </>
          )}

          <div className="mx-1 h-5 w-px bg-gray-200" />

          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Preview
          </button>

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

          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={currentProfile.status === "active" && !dirty}
            className="rounded-md bg-brand-red px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-red-dark disabled:opacity-40"
          >
            {currentProfile.status === "active" ? "Publish changes" : "Publish"}
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}
      {toast && <p className="mt-2 text-xs text-green-600">{toast}</p>}
      {isPending && <p className="mt-2 text-xs text-gray-400">Working…</p>}

      {modal === "new" && (
        <NamePromptModal
          title="New profile"
          onSubmit={async (name) => {
            const id = await createProfile(name);
            goToProfile(id);
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "duplicate" && (
        <NamePromptModal
          title="Duplicate profile"
          initialValue={`${currentProfile.name} (Copy)`}
          onSubmit={async (name) => {
            const id = await duplicateProfile(currentProfile.id, name);
            goToProfile(id);
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "rename" && (
        <NamePromptModal
          title="Rename profile"
          initialValue={currentProfile.name}
          onSubmit={async (name) => {
            await renameProfile(currentProfile.id, name);
            router.refresh();
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "delete" && (
        <ConfirmDialog
          title="Delete profile"
          message={`Are you sure you want to delete "${currentProfile.name}"? This cannot be undone.`}
          onConfirm={async () => {
            await deleteProfile(currentProfile.id);
            const fallback = profiles.find((p) => p.id !== currentProfile.id);
            if (fallback) goToProfile(fallback.id);
            else router.refresh();
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "versions" && (
        <VersionHistoryPanel profileId={currentProfile.id} onClose={() => setModal(null)} />
      )}
      {modal === "schedule" && (
        <SchedulePublishDialog
          profile={currentProfile}
          onClose={() => setModal(null)}
          onDone={() => router.refresh()}
        />
      )}
    </div>
  );
}
