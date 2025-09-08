import { WebsiteFAQs } from "@/components/website/faqs";
import { CTA2 } from "@/components/website/cta-2";
import { StufdHero } from "@/components/website/stufd-hero";
import { StufdFeatures } from "@/components/website/stufd-features";
import { StufdPricing } from "@/components/website/stufd-pricing";
import { StufdTestimonials } from "@/components/website/stufd-testimonials";

export default function WebsiteHomepage() {
  return (
    <>
      <StufdHero />
      <StufdFeatures />
      <StufdPricing />
      <StufdTestimonials />
      <WebsiteFAQs />
      <CTA2 />
    </>
  );
}
