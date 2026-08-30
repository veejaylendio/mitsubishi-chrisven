"use client";

import { useRef, useState } from "react";
import { requestUploadUrl } from "../actions";

type Folder = "hero" | "vehicles" | "reviews" | "clients";

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  accept = "image/jpeg,image/png,image/webp,image/gif",
}: {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  folder: Folder;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isVideo = accept.includes("video");

  const handleFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const { uploadUrl, publicUrl } = await requestUploadUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        folder,
      });
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      onChange(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {value && isVideo && (
          <video src={value} className="h-16 w-16 rounded-md object-cover" muted />
        )}
        {value && !isVideo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-16 rounded-md object-cover" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
        >
          {busy ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}
