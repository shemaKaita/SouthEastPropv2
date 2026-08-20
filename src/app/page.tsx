import Hero from "@/components/Hero";
import PropertyCarousel from "@/components/PropertyCarousel";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <PropertyCarousel />
      <WhyChooseUs />
    </div>
  );
}
