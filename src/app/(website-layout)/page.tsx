import { WebsiteFAQs } from "@/components/marketing/faqs";
import { CTA2 } from "@/components/marketing/cta-2";
import { WithWithout } from "@/components/marketing/with-without";
import Hero from "@/components/sections/hero";
import CTA1 from "@/components/marketing/cta-1";
import MonthlyAnnualPricing from "@/components/marketing/monthly-annual-pricing";
import TextRevealByWord from "@/components/ui/text-reveal";

export default function WebsiteHomepage() {
  return (
    <>
      <Hero />
      <CTA1 />
      <MonthlyAnnualPricing />
      <TextRevealByWord text="Still not sure? Join 200+ photographers and videographers who are already monetizing their gear and discovering new equipment. The Louisville community is growing fast!" />
      <WithWithout />
      <WebsiteFAQs />
      <CTA2 />
    </>
  );
}
