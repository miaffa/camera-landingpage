"use client"

import { WebsiteFAQs } from "@/components/website/faqs"
import { CTA2 } from "@/components/website/cta-2"
import { Hero } from "@/components/website/hero"
import { Features } from "@/components/website/features"
import { Pricing } from "@/components/website/pricing"
import { Testimonials } from "@/components/website/testimonials"

export default function WebsiteHomepage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <WebsiteFAQs />
      <CTA2 />
    </>
  )
}