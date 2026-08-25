"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useTheme } from "@/components/ThemeProvider";
import { useMounted } from "@/hooks/useMounted";
import type { Property } from "@/types/property";

const markerIcon = L.divIcon({
  className: "custom-property-marker",
  html: `<div style="background: #FBBF24; border: 2px solid #ffffff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#12285a" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -18],
});

const CAPE_TOWN_CENTER: [number, number] = [-33.918, 18.41];

function FitBoundsToMarkers({ properties }: { properties: Property[] }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length === 0) return;
    const bounds = L.latLngBounds(
      properties.map((p) => [p.lat, p.lng] as [number, number]),
    );
    map.fitBounds(bounds, {
      paddingTopLeft: [40, 40],
      paddingBottomRight: [80, 80],
      maxZoom: 14,
    });
  }, [map, properties]);
  return null;
}

export default function PropertyMapView({
  properties,
}: {
  properties: Property[];
}) {
  const { theme } = useTheme();
  const mounted = useMounted();
  const isDarkMode = mounted && theme === "dark";

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={CAPE_TOWN_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        attributionControl={true}
        zoomControl={true}
        style={{ height: "100%", width: "100%" }}
        aria-label="Interactive property map of Cape Town"
      >
        <FitBoundsToMarkers properties={properties} />
        {isDarkMode ? (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}
        {properties.map((property) => (
          <Marker
            key={property.slug}
            position={[property.lat, property.lng]}
            icon={markerIcon}
          >
            <Popup maxWidth={260} closeButton={false} autoPan={false}>
              <div className="min-w-[220px] rounded-xl bg-[var(--bg-surface)] p-4">
                <h3 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                  {property.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[var(--brand-navy)] dark:text-[var(--accent-yellow)]">
                  {property.price}
                  {property.priceLabel.startsWith("/") && (
                    <span className="ml-1 text-[10px] font-medium text-[var(--color-secondary)]">
                      {property.priceLabel}
                    </span>
                  )}
                </p>
                <Link
                  href={`/properties/${property.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-[var(--brand-navy)] uppercase underline-offset-4 hover:underline dark:text-[var(--accent-yellow)]"
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
