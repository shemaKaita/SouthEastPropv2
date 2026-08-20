"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const PropertyMapView = dynamic(() => import("./PropertyMapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-zinc-100">
      <div className="flex flex-col items-center gap-3 text-[var(--color-secondary)]">
        <MapPin className="h-8 w-8 animate-pulse" />
        <p className="text-sm font-medium uppercase tracking-[0.2em]">
          Loading map…
        </p>
      </div>
    </div>
  ),
});

export default function PropertyMap() {
  return <PropertyMapView />;
}
