/**
 * Site-wide configuration sourced from environment variables.
 *
 * Falls back to localhost for development when NEXT_PUBLIC_SITE_URL
 * is not set.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "SouthEast Properties";

export const SITE_DESCRIPTION =
  "Premium property solutions across South Africa — co-living spaces, landlord services, and expert real estate guidance.";
