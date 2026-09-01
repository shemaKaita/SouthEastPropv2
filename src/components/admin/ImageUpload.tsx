"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label: string;
};

export default function ImageUpload({
  value,
  onChange,
  label,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File): void => {
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.message ?? "Upload failed");
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  const clearImage = (): void => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold tracking-[0.15em] text-[var(--text-primary)] uppercase dark:text-[var(--text-secondary)]">
        {label}
      </label>

      {value && (
        <div className="group relative mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-40 w-full rounded-xl border border-[var(--border-subtle)] object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[var(--border-subtle)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-yellow)] hover:text-[var(--text-primary)] disabled:opacity-60"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? "Uploading…" : "Upload"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleInputChange}
          className="hidden"
        />

        <input
          type="url"
          value={value.startsWith("/uploads/") ? "" : value}
          onChange={handleUrlChange}
          placeholder="…or paste URL"
          className="dark:bg-navy-900/60 h-10 flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-all outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-yellow)] focus:ring-1 focus:ring-[var(--accent-yellow)] dark:border-white/20"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}

      {value.startsWith("/uploads/") && (
        <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
          <ImageIcon className="h-3 w-3" />
          Stored on volume: {value}
        </p>
      )}
    </div>
  );
}
