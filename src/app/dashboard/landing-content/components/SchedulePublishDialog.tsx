"use client";

import { useState } from "react";
import Modal from "./Modal";
import { scheduleProfile, unscheduleProfile } from "../actions";
import type { PageProfile } from "@/lib/types";

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SchedulePublishDialog({
  profile,
  onClose,
  onDone,
}: {
  profile: PageProfile;
  onClose: () => void;
  onDone: () => void;
}) {
  const [value, setValue] = useState(toLocalInputValue(profile.scheduled_publish_at));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSchedule = async () => {
    if (!value) return;
    setBusy(true);
    setError(null);
    try {
      await scheduleProfile(profile.id, new Date(value).toISOString());
      onDone();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to schedule");
      setBusy(false);
    }
  };

  const handleUnschedule = async () => {
    setBusy(true);
    try {
      await unscheduleProfile(profile.id);
      onDone();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to unschedule");
      setBusy(false);
    }
  };

  return (
    <Modal title="Schedule publish" onClose={onClose}>
      <p className="text-sm text-gray-600">
        Choose when &quot;{profile.name}&quot; should go live. This won&apos;t publish
        automatically — the dashboard will flag it as due and an admin publishes it with one
        click.
      </p>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}
      <div className="mt-6 flex justify-between">
        {profile.status === "scheduled" ? (
          <button
            type="button"
            onClick={handleUnschedule}
            disabled={busy}
            className="text-xs font-medium text-brand-red hover:underline"
          >
            Remove schedule
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSchedule}
            disabled={busy || !value}
            className="rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
          >
            {busy ? "Working…" : "Schedule"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
