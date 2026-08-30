"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { getVersions, restoreVersion } from "../actions";

type VersionRow = {
  id: string;
  label: string | null;
  published_at: string;
};

export default function VersionHistoryPanel({
  profileId,
  onClose,
}: {
  profileId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [versions, setVersions] = useState<VersionRow[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVersions(profileId)
      .then((data) => setVersions(data))
      .catch(() => setVersions([]));
  }, [profileId]);

  const handleRestore = async (versionId: string) => {
    setBusyId(versionId);
    setError(null);
    try {
      await restoreVersion(versionId);
      router.refresh();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to restore");
      setBusyId(null);
    }
  };

  return (
    <Modal title="Version history" onClose={onClose} wide>
      {versions === null && <p className="text-sm text-gray-400">Loading…</p>}
      {versions?.length === 0 && (
        <p className="text-sm text-gray-400">
          No previous versions yet — publishing a change over this profile creates one.
        </p>
      )}
      {error && <p className="mb-2 text-sm text-brand-red">{error}</p>}
      <ul className="divide-y divide-gray-100">
        {versions?.map((v) => (
          <li key={v.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-brand-black">{v.label ?? "Untitled"}</p>
              <p className="text-xs text-gray-400">{new Date(v.published_at).toLocaleString()}</p>
            </div>
            <button
              type="button"
              disabled={busyId === v.id}
              onClick={() => handleRestore(v.id)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              {busyId === v.id ? "Restoring…" : "Restore"}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
