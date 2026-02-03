import { HeroSection } from "@/components/home/hero-section";
import { FeaturesMarquee } from "@/components/home/features-marquee";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HowItWorks } from "@/components/home/how-it-works";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesMarquee />
      <FeaturedProducts />
      <HowItWorks />
      <FAQSection />
      <CTASection />
    </div>
  );
}
