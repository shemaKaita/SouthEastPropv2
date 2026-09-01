"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Save } from "lucide-react";
import {
  inputClassName,
  labelClassName,
  submitButtonClassName,
  serverErrorClassName,
} from "@/components/ui/formStyles";

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
  action: (
    formData: FormData,
  ) => Promise<{
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

  const removeGalleryImage = (index: number): void => {
    setData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>
          <input
            id="title"
            name="title"
            value={data.title}
            onChange={(e) => setField("title", e.target.value)}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelClassName}>
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            value={data.slug}
            onChange={(e) => setField("slug", e.target.value)}
            className={inputCls}
            placeholder="my-property"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className={labelClassName}>
            Location
          </label>
          <input
            id="location"
            name="location"
            value={data.location}
            onChange={(e) => setField("location", e.target.value)}
            className={inputCls}
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
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="price" className={labelClassName}>
            Price
          </label>
          <input
            id="price"
            name="price"
            value={data.price}
            onChange={(e) => setField("price", e.target.value)}
            className={inputCls}
            placeholder="R 2,500,000"
            required
          />
        </div>
        <div>
          <label htmlFor="priceLabel" className={labelClassName}>
            Price Label
          </label>
          <input
            id="priceLabel"
            name="priceLabel"
            value={data.priceLabel}
            onChange={(e) => setField("priceLabel", e.target.value)}
            className={inputCls}
            placeholder="For Sale / /month"
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
        <div />
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
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
          />
        </div>
      </div>

      <div>
        <label htmlFor="featuredImage" className={labelClassName}>
          Featured Image URL
        </label>
        <input
          id="featuredImage"
          name="featuredImage"
          type="url"
          value={data.featuredImage}
          onChange={(e) => setField("featuredImage", e.target.value)}
          className={inputClassName}
          placeholder="https://images.unsplash.com/..."
          required
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className={labelClassName}>Gallery Images</label>
          <button
            type="button"
            onClick={addGalleryImage}
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-yellow)]"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {data.galleryImages.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setGalleryImage(index, e.target.value)}
                className={inputClassName}
                placeholder="https://images.unsplash.com/..."
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={data.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={6}
          className={`${inputClassName} h-auto py-3`}
          required
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className={labelClassName}>Amenities</label>
          <button
            type="button"
            onClick={addAmenity}
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-yellow)]"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {data.amenities.map((amenity, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={amenity.icon}
                onChange={(e) => setAmenity(index, "icon", e.target.value)}
                className={`${inputClassName} w-40`}
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
              />
              <button
                type="button"
                onClick={() => removeAmenity(index)}
                className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className={serverErrorClassName}>{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={submitButtonClassName}
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="rounded-full border border-[var(--border-subtle)] px-6 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
