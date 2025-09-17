"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is this platform?",
    answer:
      "Our platform is a peer-to-peer camera gear rental marketplace that connects photographers nationwide. You can list your equipment for rent, find gear to rent, and share your photography work with the community.",
  },
  {
    question: "How does the rental system work?",
    answer:
      "Photographers can list their camera equipment with photos, descriptions, and rental terms. Other photographers can search for gear by location, browse listings, and book rentals. All transactions are handled securely through our platform.",
  },
  {
    question: "Do I need technical skills to list my equipment?",
    answer:
      "Not at all! Our platform is designed to be user-friendly for photographers of all skill levels. Creating a listing takes just a few minutes, and you can manage your rentals through our simple dashboard. We also provide support and guidance.",
  },
  {
    question: "Can I customize my equipment listings?",
    answer:
      "Yes! You can customize your listings with detailed descriptions, multiple photos, custom pricing, and rental terms. You can also create a professional photographer profile to showcase your work and build trust with renters.",
  },
  {
    question: "What kind of analytics do I get?",
    answer:
      "You'll get real-time insights into your rental performance, equipment utilization rates, earnings, and renter feedback. This data helps you optimize your pricing, understand which gear is most popular, and make informed decisions about your equipment.",
  },
  {
    question: "How does the review system work?",
    answer:
      "Both renters and equipment owners can rate and review each other after a rental. This builds trust in the community and helps everyone make informed decisions. Reviews are displayed on profiles and equipment listings.",
  },
  {
    question: "Can I update my listings in real-time?",
    answer:
      "Absolutely! You can update availability, pricing, descriptions, or mark equipment as unavailable instantly. Changes appear immediately to all users browsing your listings.",
  },
  {
    question: "What devices does the platform work on?",
    answer:
      "Our platform works on all devices - smartphones, tablets, and computers. The mobile app is optimized for on-the-go management, while the web platform offers full functionality for detailed management.",
  },
  {
    question: "How much does it cost to use the platform?",
    answer:
      "We offer flexible pricing plans starting at $19/month for hobbyist photographers. All plans include a 14-day free trial. We also take a small commission from successful rentals. Enterprise plans are available for photography studios and agencies.",
  },
  {
    question: "What support do you provide?",
    answer:
      "We provide comprehensive support including setup assistance, equipment listing guidance, and ongoing technical support. Our team is available via email, phone, and live chat to help you get the most out of the platform.",
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
            Can&apos;t find what you&apos;re looking for?{" "}
            <a
              href="/contact"
              className="font-medium text-primary hover:underline"
            >
              Contact our support team
            </a>{" "}
            for help
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
