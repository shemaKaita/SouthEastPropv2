"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Save, AlertCircle, Upload, ListChecks } from "lucide-react";
import {
  inputClassName,
  labelClassName,
  submitButtonClassName,
} from "@/components/ui/formStyles";
import ImageUpload from "@/components/admin/ImageUpload";

type PropertyData = {
  id?: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  priceLabel: string;
  beds: string;
  baths: string;
  area: string;
  lat: string;
  lng: string;
  availability: string;
  badge: string;
  featuredImage: string;
  galleryImages: string[];
  description: string;
  amenities: Array<{ icon: string; label: string }>;
};

type PropertyFormProps = {
  initialData?: Partial<PropertyData>;
  action: (formData: FormData) => Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, string>;
  }>;
  submitLabel: string;
};

const AMENITY_ICONS = [
  "Wifi",
  "Car",
  "Shield",
  "Waves",
  "Wind",
  "Dumbbell",
  "WashingMachine",
  "Tv",
];

const emptyData: PropertyData = {
  slug: "",
  title: "",
  location: "",
  price: "",
  priceLabel: "",
  beds: "0",
  baths: "0",
  area: "0",
  lat: "0",
  lng: "0",
  availability: "Available Now",
  badge: "",
  featuredImage: "",
  galleryImages: [],
  description: "",
  amenities: [],
};

export default function PropertyForm({
  initialData,
  action,
  submitLabel,
}: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PropertyData>({
    ...emptyData,
    ...initialData,
  });
  const [confirmingGalleryRemove, setConfirmingGalleryRemove] = useState<
    number | null
  >(null);

  const setField = (field: keyof PropertyData, value: string): void => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const addGalleryImage = (): void => {
    setData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ""],
    }));
  };

  const setGalleryImage = (index: number, value: string): void => {
    setData((prev) => {
      const images = [...prev.galleryImages];
      images[index] = value;
      return { ...prev, galleryImages: images };
    });
  };

  const requestRemoveGalleryImage = (index: number): void => {
    setConfirmingGalleryRemove(index);
  };

  const confirmRemoveGalleryImage = (index: number): void => {
    setData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
    setConfirmingGalleryRemove(null);
  };

  const addAmenity = (): void => {
    setData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, { icon: "Wifi", label: "" }],
    }));
  };

  const setAmenity = (
    index: number,
    field: "icon" | "label",
    value: string,
  ): void => {
    setData((prev) => {
      const amenities = [...prev.amenities];
      amenities[index] = { ...amenities[index], [field]: value };
      return { ...prev, amenities };
    });
  };

  const removeAmenity = (index: number): void => {
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set(
      "galleryImages",
      data.galleryImages.filter((v) => v.trim() !== "").join("\n"),
    );
    // Re-add as multiple entries
    data.galleryImages
      .filter((v) => v.trim() !== "")
      .forEach((url) => formData.append("galleryImages", url));
    formData.set("amenities", JSON.stringify(data.amenities));

    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/properties");
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  const inputCls = `${inputClassName} h-10`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      {/* ── Identity ── */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Property Identity
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={data.title}
              onChange={(e) => setField("title", e.target.value)}
              className={inputCls}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className={labelClassName}>
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              value={data.slug}
              onChange={(e) => setField("slug", e.target.value)}
              className={inputCls}
              placeholder="my-property"
              aria-required="true"
              required
            />
          </div>
        </div>
      </fieldset>

      {/* ── Listing ── */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Listing Details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className={labelClassName}>
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              value={data.location}
              onChange={(e) => setField("location", e.target.value)}
              className={inputCls}
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="availability" className={labelClassName}>
              Availability
            </label>
            <input
              id="availability"
              name="availability"
              value={data.availability}
              onChange={(e) => setField("availability", e.target.value)}
              className={inputCls}
              placeholder="Available Now"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="price" className={labelClassName}>
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              value={data.price}
              onChange={(e) => setField("price", e.target.value)}
              className={inputCls}
              placeholder="R 2,500,000"
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="priceLabel" className={labelClassName}>
              Price Label <span className="text-red-500">*</span>
            </label>
            <input
              id="priceLabel"
              name="priceLabel"
              value={data.priceLabel}
              onChange={(e) => setField("priceLabel", e.target.value)}
              className={inputCls}
              placeholder="For Sale / /month"
              aria-required="true"
              required
            />
          </div>
          <div>
            <label htmlFor="badge" className={labelClassName}>
              Badge
            </label>
            <input
              id="badge"
              name="badge"
              value={data.badge}
              onChange={(e) => setField("badge", e.target.value)}
              className={inputCls}
              placeholder="Featured, New, Hot"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Specs ── */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Specifications
        </legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          <div>
            <label htmlFor="beds" className={labelClassName}>
              Beds
            </label>
            <input
              id="beds"
              name="beds"
              type="number"
              min="0"
              value={data.beds}
              onChange={(e) => setField("beds", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="baths" className={labelClassName}>
              Baths
            </label>
            <input
              id="baths"
              name="baths"
              type="number"
              min="0"
              value={data.baths}
              onChange={(e) => setField("baths", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="area" className={labelClassName}>
              Area (m²)
            </label>
            <input
              id="area"
              name="area"
              type="number"
              min="0"
              value={data.area}
              onChange={(e) => setField("area", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Geolocation ── */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Geolocation
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lat" className={labelClassName}>
              Latitude
            </label>
            <input
              id="lat"
              name="lat"
              type="number"
              step="any"
              value={data.lat}
              onChange={(e) => setField("lat", e.target.value)}
              className={inputCls}
              placeholder="-33.9249"
            />
          </div>
          <div>
            <label htmlFor="lng" className={labelClassName}>
              Longitude
            </label>
            <input
              id="lng"
              name="lng"
              type="number"
              step="any"
              value={data.lng}
              onChange={(e) => setField("lng", e.target.value)}
              className={inputCls}
              placeholder="18.4241"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Media ── */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Media
        </legend>
        <div>
          <input
            type="hidden"
            name="featuredImage"
            value={data.featuredImage}
          />
          <ImageUpload
            value={data.featuredImage}
            onChange={(url) => setField("featuredImage", url)}
            label="Featured Image"
          />
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Upload className="h-3 w-3" />
            JPG, PNG or WebP up to 10MB, or paste a remote URL.
          </p>
        </div>

        <div>
          <input
            type="hidden"
            name="galleryImages"
            value={data.galleryImages.filter((v) => v.trim() !== "").join(",")}
          />
          <div className="mb-2 flex items-center justify-between">
            <label className={labelClassName}>Gallery Images</label>
            <button
              type="button"
              onClick={addGalleryImage}
              className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-400/30 transition-colors hover:bg-yellow-400/25 dark:text-yellow-200"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
          {data.galleryImages.length === 0 ? (
            <button
              type="button"
              onClick={addGalleryImage}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border-subtle)] py-8 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-yellow)] hover:text-[var(--text-primary)]"
            >
              <Upload className="h-5 w-5" />
              Click to add your first gallery image
            </button>
          ) : (
            <div className="space-y-3">
              {data.galleryImages.map((url, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1">
                    <ImageUpload
                      value={url}
                      onChange={(newUrl) => setGalleryImage(index, newUrl)}
                      label={`Image ${index + 1}`}
                    />
                  </div>
                  {confirmingGalleryRemove === index ? (
                    <div className="mt-7 inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1">
                      <span className="text-xs font-medium text-red-500 dark:text-red-400">
                        Remove?
                      </span>
                      <button
                        type="button"
                        onClick={() => confirmRemoveGalleryImage(index)}
                        className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white hover:bg-red-600"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingGalleryRemove(null)}
                        className="rounded px-2 py-0.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => requestRemoveGalleryImage(index)}
                      title="Remove gallery image"
                      aria-label={`Remove gallery image ${index + 1}`}
                      className="mt-7 inline-flex items-center gap-1 rounded-lg bg-slate-900/80 p-2 text-xs font-medium text-red-400 backdrop-blur-sm transition-colors hover:bg-slate-900 hover:text-red-300 dark:bg-slate-900/80"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </fieldset>

      {/* ── Description ── */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          Description
        </legend>
        <div>
          <label htmlFor="description" className={labelClassName}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={6}
            aria-required="true"
            className={`${inputClassName} h-64 resize-y overflow-y-auto py-3`}
            required
          />
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Markdown is supported. {data.description.length} characters.
          </p>
        </div>
      </fieldset>

      {/* ── Amenities ── */}
      <fieldset className="space-y-4">
        <legend className="mb-2 inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
          <ListChecks className="h-4 w-4" /> Amenities
        </legend>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={labelClassName}>Amenities</label>
            <button
              type="button"
              onClick={addAmenity}
              className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-400/30 transition-colors hover:bg-yellow-400/25 dark:text-yellow-200"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
          {data.amenities.length === 0 ? (
            <p className="rounded-xl border-2 border-dashed border-[var(--border-subtle)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
              No amenities added yet. Click <strong>+ Add</strong> to start.
            </p>
          ) : (
            <div className="space-y-2">
              {data.amenities.map((amenity, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={amenity.icon}
                    onChange={(e) => setAmenity(index, "icon", e.target.value)}
                    className={`${inputClassName} w-32 sm:w-40`}
                    aria-label={`Icon for amenity ${index + 1}`}
                  >
                    {AMENITY_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={amenity.label}
                    onChange={(e) => setAmenity(index, "label", e.target.value)}
                    className={inputClassName}
                    placeholder="High-Speed WiFi"
                    aria-label={`Label for amenity ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    title="Remove amenity"
                    aria-label={`Remove amenity ${index + 1}`}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-500/10 dark:text-red-300 dark:hover:text-red-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="inline-flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {/* Sticky bottom save bar — fixes audit finding that Save Changes is "lost" */}
      <div className="sticky bottom-4 z-20 -mx-6 mt-8 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/85 px-6 py-4 backdrop-blur-md md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-secondary)]">
            Changes are saved when you press <strong>Save</strong>. They
            won&apos;t appear on the public site until then.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/properties")}
              className="rounded-full border border-[var(--border-subtle)] px-5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={submitButtonClassName}
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
