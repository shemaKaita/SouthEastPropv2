import type { Property } from "@/types/property";

export type { Property, Amenity, AmenityIcon } from "@/types/property";

export const PROPERTIES: ReadonlyArray<Property> = [
  {
    slug: "salt-river-house",
    title: "4 Bedroom House in Salt River",
    location: "Salt River, Cape Town",
    price: "R 2,500,000",
    priceLabel: "For Sale",
    beds: 4,
    baths: 3,
    area: 220,
    lat: -33.906,
    lng: 18.478,
    availability: "Available Now",
    badge: "Featured",
    featuredImage:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80&auto=format&fit=crop",
    ],
    description:
      "A beautifully restored Victorian home in the heart of Salt River, blending original character features with thoughtful modern updates. The light-filled open-plan living area flows seamlessly onto a sun-drenched patio and landscaped garden — perfect for entertaining.\n\nUpstairs, four generous bedrooms are arranged around a central landing, with the primary suite enjoying a walk-in wardrobe and ensuite bathroom. The kitchen features bespoke cabinetry, stone countertops and integrated appliances.\n\nLocated on a quiet, tree-lined street within walking distance of the neighbourhood's best cafés and the Salt River Market, this is Cape Town's most exciting creative district.",
    amenities: [
      { icon: "Wifi", label: "High-Speed WiFi" },
      { icon: "Car", label: "Off-Street Parking" },
      { icon: "Shield", label: "24/7 Security" },
      { icon: "WashingMachine", label: "Laundry Room" },
      { icon: "Tv", label: "Smart TV" },
      { icon: "Wind", label: "Air Conditioning" },
    ],
  },
  {
    slug: "sea-point-apartment",
    title: "2 Bedroom Apartment in Sea Point",
    location: "Sea Point, Cape Town",
    price: "R 18,000",
    priceLabel: "/month",
    beds: 2,
    baths: 2,
    area: 95,
    lat: -33.915,
    lng: 18.388,
    availability: "Available 1 September",
    badge: "New",
    featuredImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556909114-44e3e9399a2d?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80&auto=format&fit=crop",
    ],
    description:
      "Sophisticated sea-facing living in this immaculate two-bedroom apartment on the Sea Point promenade. Wake up to panoramic Atlantic Ocean views from the floor-to-ceiling windows that wrap the entire living space.\n\nBoth bedrooms are generously sized with built-in wardrobes, and the main bedroom features an ensuite bathroom finished in marble-look porcelain. The open-plan kitchen includes a breakfast bar, integrated appliances and a separate scullery.\n\nThe building offers a communal rooftop pool, gym, and 24-hour concierge — a short walk to the Sea Point promenade and the vibrant restaurant strip.",
    amenities: [
      { icon: "Wifi", label: "High-Speed WiFi" },
      { icon: "Waves", label: "Sea View" },
      { icon: "Dumbbell", label: "Gym Access" },
      { icon: "Shield", label: "24/7 Concierge" },
      { icon: "WashingMachine", label: "In-Unit Laundry" },
      { icon: "Tv", label: "Smart TV" },
      { icon: "Wind", label: "Air Conditioning" },
    ],
  },
  {
    slug: "gardens-townhouse",
    title: "3 Bedroom Townhouse in Gardens",
    location: "Gardens, Cape Town",
    price: "R 4,200,000",
    priceLabel: "For Sale",
    beds: 3,
    baths: 2,
    area: 165,
    lat: -33.929,
    lng: 18.411,
    availability: "Available Now",
    badge: "Hot",
    featuredImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&q=80&auto=format&fit=crop",
    ],
    description:
      "A contemporary three-bedroom townhouse set within a secure boutique complex in the leafy suburb of Gardens. The home spans three levels, with a bright double-volume living area opening onto a private courtyard garden.\n\nThe kitchen is finished with engineered stone countertops, soft-close cabinetry and a gas hob — designed for both everyday living and effortless entertaining. All three bedrooms are carpeted with built-in cupboards, and the main bedroom enjoys a private balcony with Table Mountain views.\n\nThe complex is pet-friendly with a secure dog-run area, and is moments from the MyCiTi bus route and Kloof Street's renowned restaurants.",
    amenities: [
      { icon: "Wifi", label: "Fibre Internet" },
      { icon: "Car", label: "Single Garage" },
      { icon: "Shield", label: "24-Hour Security" },
      { icon: "WashingMachine", label: "Laundry Room" },
      { icon: "Tv", label: "Smart TV" },
      { icon: "Wind", label: "Air Conditioning" },
      { icon: "Dumbbell", label: "Communal Gym" },
    ],
  },
  {
    slug: "clifton-villa",
    title: "5 Bedroom Villa in Clifton",
    location: "Clifton, Cape Town",
    price: "R 85,000",
    priceLabel: "/month",
    beds: 5,
    baths: 4,
    area: 480,
    lat: -33.932,
    lng: 18.376,
    availability: "Available 1 October",
    badge: "Premium",
    featuredImage:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80&auto=format&fit=crop",
    ],
    description:
      "An iconic Clifton villa perched above the Atlantic seaboard, offering uninterrupted ocean views from nearly every room. Designed by a celebrated Cape Town architect, this five-bedroom residence fuses clean lines with warm natural materials.\n\nThe expansive entertainment level features a sunken lounge, formal dining room, and a chef's kitchen that flows onto an infinity-edge pool and timber deck. Floor-to-ceiling glass doors slide away to create a seamless indoor-outdoor experience.\n\nAll five bedrooms are ensuite, with the primary suite offering a private terrace, walk-in dressing room and a spa-style bathroom with freestanding bath overlooking the sea. Full staff accommodation and double garage included.",
    amenities: [
      { icon: "Wifi", label: "High-Speed WiFi" },
      { icon: "Waves", label: "Ocean View" },
      { icon: "Shield", label: "24/7 Manned Security" },
      { icon: "Car", label: "Double Garage" },
      { icon: "Dumbbell", label: "Private Gym" },
      { icon: "WashingMachine", label: "Staff Laundry" },
      { icon: "Tv", label: "Home Theatre" },
      { icon: "Wind", label: "Climate Control" },
    ],
  },
  {
    slug: "green-point-studio",
    title: "1 Bedroom Studio in Green Point",
    location: "Green Point, Cape Town",
    price: "R 11,500",
    priceLabel: "/month",
    beds: 1,
    baths: 1,
    area: 45,
    lat: -33.909,
    lng: 18.405,
    availability: "Available Now",
    badge: "New",
    featuredImage:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505873242700-287d29bd5473?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7d6a?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154125589-da1f8771af2c?w=600&q=80&auto=format&fit=crop",
    ],
    description:
      "A compact but beautifully designed studio apartment in the heart of Green Point, perfect for a young professional or couple. The open-plan layout maximises every square metre with clever built-in storage and multi-functional furniture.\n\nThe kitchenette is fully equipped with energy-efficient appliances, and the bathroom features a walk-in rain shower with premium tiling. The building includes a communal laundry, secure bicycle storage, and a rooftop terrace with Table Mountain views.\n\nGreen Point is one of Cape Town's most walkable neighbourhoods — steps from the promenade, the stadium precinct, and some of the city's best cafés and restaurants.",
    amenities: [
      { icon: "Wifi", label: "High-Speed WiFi" },
      { icon: "Shield", label: "Secure Access" },
      { icon: "WashingMachine", label: "Communal Laundry" },
      { icon: "Tv", label: "Smart TV" },
      { icon: "Wind", label: "Air Conditioning" },
    ],
  },
];

// Data access functions have moved to src/lib/properties.ts (repository layer).
// Import from there instead of this file.
