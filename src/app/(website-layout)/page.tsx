"use client"

import { useState } from "react"
import { WebsiteFAQs } from "@/components/website/faqs"
import { CTA2 } from "@/components/website/cta-2"
import { Hero } from "@/components/website/hero"
import { Features } from "@/components/website/features"
import { Pricing } from "@/components/website/pricing"
import { Testimonials } from "@/components/website/testimonials"
import Hero2 from "@/components/website/hero-2"

export default function WebsiteHomepage() {
  // Temporary state to control what's shown
  // Set to true to show only waitlist, false to show full landing page
  const [showWaitlistOnly] = useState(true)

  if (showWaitlistOnly) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <Hero2 />
      </div>
    )
  }

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