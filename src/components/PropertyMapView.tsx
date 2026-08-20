"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PROPERTIES } from "@/data/properties";

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

function FitBoundsToMarkers() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(
      PROPERTIES.map((p) => [p.lat, p.lng] as [number, number]),
    );
    map.fitBounds(bounds, {
      paddingTopLeft: [40, 40],
      paddingBottomRight: [80, 80],
      maxZoom: 14,
    });
  }, [map]);
  return null;
}

export default function PropertyMapView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <div className="relative h-full w-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .leaflet-popup-content-wrapper {
              border-radius: 12px;
              box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3);
              padding: 0;
              background: var(--bg-surface) !important;
              color: var(--text-primary) !important;
            }
            .leaflet-popup-tip {
              background: var(--bg-surface) !important;
            }
            .leaflet-popup-content {
              margin: 0;
              width: auto !important;
            }
            .custom-property-marker {
              background: transparent;
              border: none;
            }
            .leaflet-control-zoom {
              border-radius: 8px !important;
              box-shadow: 0 4px 12px -2px rgba(0,0,0,0.15) !important;
            }
            .leaflet-control-zoom a {
              background: var(--bg-surface, #f8fafc) !important;
              color: var(--text-primary, #12285a) !important;
              border-color: var(--border-subtle, #e2e8f0) !important;
            }
            .leaflet-control-zoom a:hover {
              background: #FBBF24 !important;
              color: #12285A !important;
            }
            .leaflet-control-attribution {
              background: rgba(255,255,255,0.85) !important;
              padding: 2px 8px !important;
              border-radius: 4px !important;
              font-size: 10px !important;
            }
            @media (prefers-color-scheme: dark) {
              .leaflet-control-zoom a {
                background: #0e1a38 !important;
                color: #F8FAFC !important;
                border-color: rgba(255,255,255,0.15) !important;
              }
              .leaflet-control-zoom a:hover {
                background: #FCD34D !important;
                color: #12285A !important;
              }
              .leaflet-control-attribution {
                background: rgba(9,18,41,0.85) !important;
                color: #CBD5E1 !important;
              }
              .leaflet-control-attribution a {
                color: #FCD34D !important;
              }
            }
            .leaflet-container {
              filter: brightness(1.05) contrast(0.95);
            }
            @media (prefers-color-scheme: dark) {
              .leaflet-tile-pane {
                filter: brightness(1.4) contrast(1.15) saturate(1.1);
              }
            }
          `,
        }}
      />
      <MapContainer
        center={CAPE_TOWN_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        attributionControl={true}
        zoomControl={true}
        style={{ height: "100%", width: "100%" }}
      >
        <FitBoundsToMarkers />
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
        {PROPERTIES.map((property) => (
          <Marker
            key={property.slug}
            position={[property.lat, property.lng]}
            icon={markerIcon}
            eventHandlers={{
              click: () => setSelectedId(property.slug),
            }}
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
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-navy)] underline-offset-4 hover:underline dark:text-[var(--accent-yellow)]"
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
