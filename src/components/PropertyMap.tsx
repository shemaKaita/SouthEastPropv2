"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import { useMounted } from "@/hooks/useMounted";

const PropertyMapView = dynamic(() => import("./PropertyMapView"), {
  ssr: false,
});

/**
 * Map bounds covering all properties with padding.
 * Computed from data so it stays accurate as properties are added.
 */
function computeBounds(properties: Property[]) {
  const lats = properties.map((p) => p.lat);
  const lngs = properties.map((p) => p.lng);
  const padding = 0.005; // ~500m padding
  return {
    minLat: Math.min(...lats) - padding,
    maxLat: Math.max(...lats) + padding,
    minLng: Math.min(...lngs) - padding,
    maxLng: Math.max(...lngs) + padding,
  };
}

/**
 * Project (lat, lng) → (x%, y%) for an SVG overlay matching the map's bounds.
 * Latitude is inverted (north = top).
 */
function project(
  lat: number,
  lng: number,
  bounds: ReturnType<typeof computeBounds>,
): { x: number; y: number } {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
  return { x, y };
}

/**
 * Static, server-renderable map showing property pins over a Cape Town image.
 * Used as the initial render so /locations is interactive instantly — no
 * Leaflet download, no map tile fetches blocking first paint. After
 * hydration, swaps to the full interactive Leaflet map.
 */
export default function PropertyMap({ properties }: { properties: Property[] }) {
  const hydrated = useMounted();
  const bounds = computeBounds(properties);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Static fallback — always in DOM so first paint shows pins */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          hydrated ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={hydrated}
      >
        <Image
          src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80&auto=format&fit=crop"
          alt="Cape Town aerial view"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-900/40" />

        {/* Property pins */}
        {properties.map((property) => {
          const pos = project(property.lat, property.lng, bounds);
          return (
            <Link
              key={property.slug}
              href={`/properties/${property.slug}`}
              aria-label={`View ${property.title}`}
              className="group absolute -translate-x-1/2 -translate-y-full rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-yellow)] focus:ring-offset-2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-yellow)] text-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.4)] ring-2 ring-white transition-transform group-hover:scale-110 group-focus:scale-110">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-primary)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                {property.location.split(",")[0]}
              </span>
            </Link>
          );
        })}

        {/* Overlay CTA */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            <MapPin className="h-4 w-4" />
            {properties.length} properties in Cape Town
          </div>
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-secondary)]">
            Loading interactive map
            <ArrowRight className="h-3 w-3 animate-pulse" />
          </span>
        </div>
      </div>

      {/* Interactive map — loaded after hydration */}
      {hydrated && (
        <div className="absolute inset-0">
          <PropertyMapView properties={properties} />
        </div>
      )}
    </div>
  );
}