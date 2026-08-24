import Hero from "@/components/Hero";
import PropertyCarousel from "@/components/PropertyCarousel";
import WhyChooseUs from "@/components/WhyChooseUs";
import { getAllPropertiesSync } from "@/lib/properties";

export default function Home() {
  const properties = getAllPropertiesSync();
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <PropertyCarousel properties={properties} />
      <WhyChooseUs />
    </div>
  );
}
