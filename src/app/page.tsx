import Hero from "@/components/Hero";
import PropertyCarousel from "@/components/PropertyCarousel";
import WhyChooseUs from "@/components/WhyChooseUs";
import { getAllPropertiesSync } from "@/lib/properties";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SouthEast Properties | Premium Real Estate in South Africa",
  description:
    "Discover premium co-living spaces and expert asset management across Cape Town. Curated properties for discerning tenants and landlords.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const properties = getAllPropertiesSync();
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <PropertyCarousel properties={properties} />
      <WhyChooseUs />
    </div>
  );
}
