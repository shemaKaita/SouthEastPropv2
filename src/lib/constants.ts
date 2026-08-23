/**
 * Application-wide shared constants.
 *
 * Previously duplicated across Navbar, Footer, Contact, and Locations.
 * Now imported from this single source of truth.
 */

export type NavItem = {
  number: string;
  label: string;
  href: string;
};

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { number: "01", label: "Home", href: "/" },
  { number: "02", label: "Locations", href: "/locations" },
  { number: "03", label: "Our Story", href: "/our-story" },
  { number: "04", label: "Landlords", href: "/landlords" },
  { number: "05", label: "Contact", href: "/contact" },
];

export type SocialLink = {
  label: string;
  href: string;
};

export const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X (Twitter)", href: "https://x.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

export type ContactDetail = {
  label: string;
  text: string;
  href: string;
};

export const CONTACT_DETAILS: ReadonlyArray<ContactDetail> = [
  {
    label: "Address",
    text: "42 Lower Main Road, Observatory, Cape Town",
    href: "https://maps.google.com/?q=Observatory+Cape+Town",
  },
  {
    label: "Phone",
    text: "+27 (0) 21 000 0000",
    href: "tel:+27210000000",
  },
  {
    label: "Email",
    text: "info@southeastproperties.co.za",
    href: "mailto:info@southeastproperties.co.za",
  },
];

export const PROPERTY_TYPES: ReadonlyArray<string> = [
  "House",
  "Apartment",
  "Townhouse",
  "Commercial",
  "Land",
  "Other",
];

export const COMPANY = {
  name: "SouthEast Properties",
  tagline: "Premium Real Estate in South Africa",
  registration: "PPRA Registered",
} as const;
