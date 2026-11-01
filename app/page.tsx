import React from "react";
import { HeroSection } from "@/components/sections/hero";
import { TrustStatsSection } from "@/components/sections/trust-stats";
import { ServicesSection } from "@/components/sections/services";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { PortfolioSection } from "@/components/sections/portfolio";
import { VisualShowcaseSection } from "@/components/sections/visual-showcase";
import { PhotoGallerySection } from "@/components/sections/photo-gallery";
import { ProcessSection } from "@/components/sections/process";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { VideoShowcaseSection } from "@/components/sections/video-showcase";
import { AboutSection } from "@/components/sections/about";
import { FAQSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { CTABannerSection } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <TrustStatsSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <PortfolioSection />
      <VisualShowcaseSection />
      <PhotoGallerySection />
      <ProcessSection />
      <TestimonialsSection />
      <VideoShowcaseSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <CTABannerSection />
    </div>
  );
}
