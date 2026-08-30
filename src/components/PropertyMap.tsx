"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const PropertyMapView = dynamic(() => import("./PropertyMapView"), {
  ssr: false,
  loading: () => (
    // Theme-aware placeholder: uses the same CSS variables as the loaded map
    // container so there is no light/dark flash when the Leaflet chunk mounts.
    <div className="flex h-full w-full items-center justify-center bg-[var(--bg-base)]">
      <div className="flex flex-col items-center gap-3 text-[var(--color-secondary)]">
        <MapPin className="h-8 w-8 animate-pulse" />
        <p className="text-sm font-medium tracking-[0.2em] uppercase">
          Loading map…
        </p>
      </div>
    </div>
  ),
});

import type { Property } from "@/types/property";

export default function PropertyMap({
  properties,
}: {
  properties: Property[];
}) {
  return <PropertyMapView properties={properties} />;
}
