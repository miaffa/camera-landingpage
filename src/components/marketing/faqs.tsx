"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is LensFlare?",
    answer:
      "LensFlare is a peer-to-peer camera gear rental platform with a social feed where photographers and videographers can rent out their equipment, discover new gear, and showcase their work. Think Airbnb + Depop + Instagram for photography & video gear.",
  },
  {
    question: "How does the rental process work?",
    answer:
      "Simply browse available gear in your area, select your rental dates, and book directly with the owner. We handle secure payments, insurance, and provide in-app messaging for coordination. Both parties pay a 5% commission (10% total).",
  },
  {
    question: "Is my gear protected if I rent it out?",
    answer:
      "Yes! We provide comprehensive insurance coverage for all rentals, including damage and theft protection. We also use escrow payments to ensure you&apos;re paid securely, and have a 72-hour resolution process for any claims.",
  },
  {
    question: "What types of camera gear can I list?",
    answer:
      "You can list any professional photography or videography equipment including cameras, lenses, lighting, audio gear, stabilizers, drones, and accessories. We focus on quality gear that creators actually want to rent.",
  },
  {
    question: "How do I get started as a renter?",
    answer:
      "Create your profile, verify your identity, and start browsing gear in your area. You can filter by camera type, lens type, price, and location. Once you find what you need, book it and coordinate pickup with the owner.",
  },
  {
    question: "How do I list my gear?",
    answer:
      "Take high-quality photos of your equipment, add detailed specs and pricing, set your availability calendar, and publish your listing. We&apos;ll help you optimize your listing for better visibility and bookings.",
  },
  {
    question: "What about the social feed?",
    answer:
      "Our social feed lets you showcase your work, tag the gear you used, and connect with other creators. Every post can drive gear rentals - when someone sees your amazing shot, they can rent the same setup directly from your post.",
  },
  {
    question: "How do you ensure trust and safety?",
    answer:
      "We use ID verification, user reviews, trust badges, and community verification. All gear photos are timestamped, and we have clear policies for damage claims. Our 72-hour resolution process ensures quick dispute resolution.",
  },
  {
    question: "What makes LensFlare different from other rental platforms?",
    answer:
      "We&apos;re community-driven with a lower 10% commission (vs 15% industry standard), mobile-first PWA experience, and integrated social feed. We focus on local density and building real relationships between creators.",
  },
  {
    question: "Where is LensFlare available?",
    answer:
      "We&apos;re launching in Louisville, Kentucky with plans to expand to other major cities. Our supply-first approach means we&apos;re building local communities of creators who can rent from each other and grow together.",
  },
];

export function WebsiteFAQs() {
  return (
    <aside className="bg-muted/40 py-16 sm:py-24" aria-label="Frequently Asked Questions">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Can&apos;t find what you&apos;re looking for? Join our{" "}
            <a
              href="https://discord.gg/lensflare"
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord community
            </a>{" "}
            for support
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </aside>
  );
}
