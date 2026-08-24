/**
 * Domain types for property listings.
 *
 * These types are the single source of truth for property-related data
 * structures across the application. All data access layers, components,
 * and server actions should import from here.
 */

export type AmenityIcon =
  | "Wifi"
  | "Car"
  | "Shield"
  | "Waves"
  | "Wind"
  | "Dumbbell"
  | "WashingMachine"
  | "Tv";

export type Amenity = {
  icon: AmenityIcon;
  label: string;
};

export type Property = {
  slug: string;
  title: string;
  location: string;
  price: string;
  priceLabel: string;
  beds: number;
  baths: number;
  area: number;
  lat: number;
  lng: number;
  availability: string;
  badge: string;
  featuredImage: string;
  galleryImages: string[];
  description: string;
  amenities: Amenity[];
};
